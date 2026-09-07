import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, writeFile, symlink, rm } from 'node:fs/promises'
import path from 'node:path'
import { applyPlan, buildPlan, readTarget, targetFingerprint } from './transfer.mjs'
import { fileHash, hash } from './content.mjs'

export async function verifyGuards(payload, root, bundle, bundlePath, mappings) {
  const before = targetFingerprint(await readTarget(payload))
  const mediaDir = payload.collections.media.config.upload.staticDir
  const beforeFiles = (await readdir(mediaDir)).sort()
  const directory = await mkdtemp(path.join(root, 'guard-test-'))
  try {
    const stale = await buildPlan(payload, bundle, mappings)
    stale.targetHash = 'deliberately-stale'
    const { sha256: ignored, ...staleData } = stale
    void ignored
    stale.sha256 = hash(staleData)
    await assert.rejects(() => applyPlan(payload, bundle, bundlePath, mappings, stale, path.join(directory, 'stale-receipt.json')), /Target changed since planning/)

    // Create a valid, distinct JPEG first, then fail validation on the LAST group.
    // This verifies rollback of earlier updates and cleanup of newly written files.
    const invalid = structuredClone(bundle)
    await mkdir(path.join(directory, 'media'))
    for (let i = 0; i < invalid.assets.length; i++) {
      const asset = invalid.assets[i]
      const source = path.join(path.dirname(bundlePath), 'media', asset.filename)
      const target = path.join(directory, 'media', asset.filename)
      if (i === 0) {
        const bytes = Buffer.concat([await readFile(source), Buffer.from('\nlocal rollback verification\n')])
        await writeFile(target, bytes)
        asset.sha256 = fileHash(bytes)
        asset.size = bytes.length
      } else await symlink(source, target)
    }
    invalid.recruitment[0].order = 98765
    invalid.recruitment.at(-1).description = null
    const { sha256: oldHash, ...invalidData } = invalid
    void oldHash
    invalid.sha256 = hash(invalidData)
    const plan = await buildPlan(payload, invalid, mappings)
    assert.ok(plan.assets.some(x => x.action === 'create'))
    await assert.rejects(() => applyPlan(payload, invalid, path.join(directory, 'bundle.json'), mappings, plan, path.join(directory, 'rollback-receipt.json')), error => error.name === 'ValidationError')
    assert.equal(targetFingerprint(await readTarget(payload)), before)
    assert.deepEqual((await readdir(mediaDir)).sort(), beforeFiles)
    const result = { stalePlanRejected: true, databaseRollback: true, newFileCleanup: true }
    await writeFile(path.join(root, 'guard-results.json'), JSON.stringify(result, null, 2))
    return result
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
