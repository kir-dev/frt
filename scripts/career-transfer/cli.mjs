import { postgresAdapter } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'
import path from 'node:path'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import appConfig from '../../src/payload.config'
import { migrations } from '../../src/migrations'
import { loadBundle, buildPlan, applyPlan } from './transfer.mjs'
import { verifyGuards } from './verify-guards.mjs'

process.umask(0o077)
const root = process.env.FRT_TRANSFER_ROOT
const database = process.env.FRT_TRANSFER_DATABASE
const uri = new URL(process.env.DATABASE_URI)
if (uri.hostname !== '127.0.0.1' || uri.port !== '55441' || uri.pathname !== `/${database}` || !/^frt_transfer_(candidate|staging)$/.test(database)) {
  throw new Error('Only the dedicated local rehearsal databases are allowed')
}
// No environment files are loaded by this runner. Block fetch even if a future hook adds an integration.
globalThis.fetch = async () => { throw new Error('External requests are disabled during content rehearsal') }
const config = await appConfig
config.telemetry = false
config.db = postgresAdapter({ pool: { connectionString: uri.href }, push: false, disableCreateDatabase: true, migrationDir: path.resolve('src/migrations') })
config.email = () => ({ name: 'disabled', defaultFromAddress: 'disabled@localhost', defaultFromName: 'Disabled', sendEmail: async () => { throw new Error('Email is disabled during rehearsal') } })
for (const collection of config.collections) {
  if (collection.upload) collection.upload.staticDir = path.join(root, database, collection.slug === 'application-cvs' ? 'private/cvs' : collection.slug)
}
await mkdir(path.join(root, database, 'media'), { recursive: true })
const payload = await getPayload({ config })
try {
  const command = process.argv[2]
  if (command === 'migrate') {
    if (database !== 'frt_transfer_candidate') throw new Error('Only the candidate may be migrated')
    await payload.db.migrate({ migrations })
    console.log('Migrations completed')
  } else if (command === 'export') {
    const recruitment = await payload.find({ collection: 'recruitment', depth: 0, pagination: false, sort: 'id' })
    const settings = await payload.findGlobal({ slug: 'career-settings', depth: 0 })
    const media = await payload.find({ collection: 'media', depth: 0, pagination: false, sort: 'id' })
    const result = { database, recruitment: recruitment.docs, settings, media: media.docs }
    await writeFile(path.join(root, `${database}.json`), JSON.stringify(result, null, 2))
    console.log(JSON.stringify({ database, groups: result.recruitment.map(doc => ({ id: doc.id, name: doc.groupName, positions: doc.positions.length })), faqs: settings.faqs?.length ?? 0, questions: settings.formQuestions?.length ?? 0, media: media.docs.length }))
  } else if (['plan', 'apply', 'verify-guards'].includes(command)) {
    if (database !== 'frt_transfer_candidate') throw new Error('Only the candidate may receive an import')
    const bundlePath = path.join(root, 'bundle/bundle.json')
    const bundle = await loadBundle(bundlePath)
    const mappings = JSON.parse(await readFile(path.join(root, 'group-mapping.json')))
    const planPath = path.join(root, 'import-plan.json')
    if (command === 'verify-guards') {
      console.log(JSON.stringify(await verifyGuards(payload, root, bundle, bundlePath, mappings)))
    } else if (command === 'plan') {
      const plan = await buildPlan(payload, bundle, mappings)
      await writeFile(planPath, JSON.stringify(plan, null, 2))
      console.log(JSON.stringify(plan, null, 2))
    } else {
      const plan = JSON.parse(await readFile(planPath))
      console.log(JSON.stringify(await applyPlan(payload, bundle, bundlePath, mappings, plan, path.join(root, 'import-receipt.json')), null, 2))
    }
  } else if (command === 'audit') {
    const tables = await payload.db.pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
    const result = {}
    for (const { tablename } of tables.rows) {
      const table = `"${tablename.replaceAll('"', '""')}"`
      const query = await payload.db.pool.query(`SELECT count(*)::int AS count, md5(coalesce(string_agg(to_jsonb(t)::text, E'\\n' ORDER BY to_jsonb(t)::text), '')) AS hash FROM ${table} t`)
      result[tablename] = query.rows[0]
    }
    const filename = process.argv[3]
    if (!filename || path.basename(filename) !== filename || !filename.endsWith('.json')) throw new Error('Provide an audit JSON filename')
    await writeFile(path.join(root, filename), JSON.stringify(result, null, 2))
    console.log(`Audited ${tables.rows.length} tables -> ${filename}`)
  } else {
    throw new Error(`Unknown command: ${command}`)
  }
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await payload.destroy()
}
// Payload's own CLI also exits explicitly: adapter.destroy does not close its pool.
process.exit(process.exitCode ?? 0)
