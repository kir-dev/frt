import { createLocalReq, initTransaction, commitTransaction, killTransaction } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import { readFile, writeFile, rm, access } from 'node:fs/promises'
import path from 'node:path'
import { content, fileHash, hash, remapMedia, validateMapping, mediaReferences } from './content.mjs'

export async function readTarget(payload, req) {
  const recruitment = await payload.find({ collection: 'recruitment', depth: 0, pagination: false, sort: 'id', req })
  const settings = await payload.findGlobal({ slug: 'career-settings', depth: 0, req })
  const media = await payload.find({ collection: 'media', depth: 0, pagination: false, sort: 'id', req })
  return { recruitment: recruitment.docs, settings, media: media.docs }
}

export function targetFingerprint(target) {
  return hash({
    recruitment: target.recruitment.map(doc => ({ id: doc.id, updatedAt: doc.updatedAt, data: content(doc, 'group') })),
    settings: { data: content(target.settings, 'settings'), updatedAt: target.settings.updatedAt },
    media: target.media.map(({ id, filename, alt, filesize, updatedAt }) => ({ id, filename, alt, filesize, updatedAt })),
  })
}

export async function loadBundle(filename) {
  const bundle = JSON.parse(await readFile(filename, 'utf8'))
  const { sha256, ...data } = bundle
  if (bundle.version !== 1 || hash(data) !== sha256) throw new Error('Bundle checksum mismatch')
  const refs = mediaReferences([bundle.recruitment, bundle.settings])
  for (const doc of bundle.recruitment) if (doc.image) refs.add(doc.image)
  if (new Set(bundle.assets.map(x => x.sourceID)).size !== bundle.assets.length || refs.size !== bundle.assets.length || [...refs].some(id => !bundle.assets.some(x => x.sourceID === id))) throw new Error('Incomplete or duplicate media assets')
  for (const asset of bundle.assets) {
    if (path.basename(asset.filename) !== asset.filename) throw new Error('Invalid asset filename')
    const bytes = await readFile(path.join(path.dirname(filename), 'media', asset.filename))
    if (bytes.length !== asset.size || fileHash(bytes) !== asset.sha256) throw new Error(`Asset checksum mismatch: ${asset.filename}`)
  }
  return bundle
}

export async function buildPlan(payload, bundle, mappings, req, targetIdentity) {
  const target = await readTarget(payload, req)
  // A completed run may have renamed a target group to its source name.
  validateMapping(bundle.recruitment, target.recruitment, mappings.map(m => ({ ...m,
    targetName: target.recruitment.find(t => t.id === m.targetID)?.groupName === m.sourceName ? m.sourceName : m.targetName,
  })))
  const mediaDir = payload.collections.media.config.upload.staticDir
  const assets = []
  for (const asset of bundle.assets) {
    const importName = `career-${asset.sha256}${path.extname(asset.filename).toLowerCase()}`
    const candidates = target.media.filter(doc => [asset.filename, importName].includes(doc.filename))
    const matches = []
    for (const doc of candidates) {
      const bytes = await readFile(path.join(mediaDir, doc.filename))
      if (fileHash(bytes) === asset.sha256 && doc.alt === asset.alt) matches.push(doc)
    }
    if (matches.length > 1) throw new Error(`Ambiguous target image: ${asset.filename}`)
    if (!matches.length && candidates.some(x => x.filename === importName)) throw new Error(`Conflicting import image: ${importName}`)
    assets.push({ sourceID: asset.sourceID, action: matches.length ? 'reuse' : 'create', targetID: matches[0]?.id ?? null, filename: matches[0]?.filename ?? importName, sha256: asset.sha256 })
  }
  const mediaMap = Object.fromEntries(assets.map(asset => [asset.sourceID, asset.targetID ?? `new:${asset.sha256}`]))
  const groups = mappings.map(mapping => {
    const source = bundle.recruitment.find(doc => doc.id === mapping.sourceID)
    const before = content(target.recruitment.find(doc => doc.id === mapping.targetID), 'group')
    const after = remapMedia(content(source, 'group'), mediaMap)
    after.image = source.image ? mediaMap[source.image] : null
    return { sourceID: mapping.sourceID, targetID: mapping.targetID, name: source.groupName,
      action: hash(before) === hash(after) ? 'unchanged' : 'update',
      changedFields: Object.keys(after).filter(key => hash(before[key]) !== hash(after[key])),
      positionsBefore: before.positions.length, positionsAfter: after.positions.length,
      oldPositions: before.positions.map(x => x.positionName), newPositions: after.positions.map(x => x.positionName),
    }
  })
  const beforeSettings = content(target.settings, 'settings')
  const afterSettings = remapMedia(content(bundle.settings, 'settings'), mediaMap)
  const settings = { action: hash(beforeSettings) === hash(afterSettings) ? 'unchanged' : 'update',
    changedFields: Object.keys(afterSettings).filter(key => hash(beforeSettings[key]) !== hash(afterSettings[key])),
    authority: 'staging',
    sourceIntegrationConfigured: !!bundle.settings.spreadsheetUrl,
    targetIntegrationConfigured: !!target.settings.spreadsheetUrl,
  }
  const data = { version: 1, bundleHash: bundle.sha256, targetHash: targetFingerprint(target), mappingHash: hash(mappings), assets, groups, settings, ...(targetIdentity ? { target: targetIdentity } : {}) }
  return { ...data, sha256: hash(data) }
}

export async function applyPlan(payload, bundle, bundlePath, mappings, approvedPlan, receiptPath, { targetIdentity } = {}) {
  const { sha256, ...planData } = approvedPlan
  if (hash(planData) !== sha256 || approvedPlan.bundleHash !== bundle.sha256 || approvedPlan.mappingHash !== hash(mappings)) throw new Error('Plan checksum or input mismatch')
  const req = await createLocalReq({ context: { skipSheetSync: true } }, payload)
  const createdFiles = new Set()
  const mediaDir = payload.collections.media.config.upload.staticDir
  let committed = false
  let commitAttempted = false
  const receipt = { planHash: sha256, bundleHash: bundle.sha256, createdMedia: [], updatedGroups: [], updatedSettings: false, ...(targetIdentity ? { target: targetIdentity } : {}) }
  try {
    await initTransaction(req)
    const transaction = payload.db.sessions[await req.transactionID]?.db
    if (!transaction) throw new Error('A real PostgreSQL transaction is required')
    await transaction.execute(sql`SET LOCAL lock_timeout = '5s'`)
    await transaction.execute(sql`LOCK TABLE recruitment, recruitment_positions, recruitment_positions_sections, career_settings, career_settings_faqs, career_settings_form_questions, career_settings_form_questions_options, media IN SHARE ROW EXCLUSIVE MODE`)
    const currentPlan = await buildPlan(payload, bundle, mappings, req, targetIdentity)
    if (currentPlan.sha256 !== sha256) throw new Error('Target changed since planning; generate and review a new plan')
    const mediaMap = {}
    for (const action of approvedPlan.assets) {
      if (action.action === 'reuse') { mediaMap[action.sourceID] = action.targetID; continue }
      const asset = bundle.assets.find(x => x.sourceID === action.sourceID)
      const destination = path.join(mediaDir, action.filename)
      try { await access(destination); throw new Error(`Untracked target file already exists: ${action.filename}`) }
      catch (error) { if (error.code !== 'ENOENT') throw error }
      createdFiles.add(destination)
      const data = await readFile(path.join(path.dirname(bundlePath), 'media', asset.filename))
      const doc = await payload.create({ collection: 'media', data: { alt: asset.alt },
        file: { data, name: action.filename, mimetype: asset.mimeType, size: data.length }, req })
      createdFiles.add(path.join(mediaDir, doc.filename))
      if (fileHash(await readFile(path.join(mediaDir, doc.filename))) !== asset.sha256) throw new Error(`Upload changed file content: ${asset.filename}`)
      mediaMap[action.sourceID] = doc.id
      receipt.createdMedia.push({ sourceID: action.sourceID, targetID: doc.id, filename: doc.filename })
    }
    for (const action of approvedPlan.groups) {
      if (action.action === 'unchanged') continue
      const source = bundle.recruitment.find(doc => doc.id === action.sourceID)
      const data = remapMedia(content(source, 'group'), mediaMap)
      data.image = source.image ? mediaMap[source.image] : null
      await payload.update({ collection: 'recruitment', id: action.targetID, data, depth: 0, req })
      receipt.updatedGroups.push(action.targetID)
    }
    if (approvedPlan.settings.action !== 'unchanged') {
      await payload.updateGlobal({ slug: 'career-settings', data: remapMedia(content(bundle.settings, 'settings'), mediaMap), depth: 0, req })
      receipt.updatedSettings = true
    }
    const afterPlan = await buildPlan(payload, bundle, mappings, req, targetIdentity)
    if (afterPlan.groups.some(x => x.action !== 'unchanged') || afterPlan.assets.some(x => x.action !== 'reuse') || afterPlan.settings.action !== 'unchanged') throw new Error('Imported content differs from the bundle')
    receipt.afterHash = afterPlan.targetHash
    // Record pending outcome before commit; never report committed until PostgreSQL confirms it.
    await writeFile(receiptPath, JSON.stringify({ ...receipt, status: 'pending-commit' }, null, 2))
    commitAttempted = true
    await commitTransaction(req)
    committed = true
    await writeFile(receiptPath, JSON.stringify({ ...receipt, status: 'committed' }, null, 2))
    return receipt
  } catch (error) {
    if (!committed && !commitAttempted) {
      await killTransaction(req)
      for (const filename of createdFiles) await rm(filename, { force: true })
    }
    if (!committed && commitAttempted) {
      // A lost COMMIT response does not prove rollback. Keep files for reconciliation.
      await writeFile(receiptPath, JSON.stringify({ ...receipt, status: 'commit-uncertain' }, null, 2)).catch(() => {})
    }
    throw error
  }
}
