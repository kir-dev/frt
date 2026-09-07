import { postgresAdapter } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'
import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import appConfig from '../../src/payload.config'
import { migrations } from '../../src/migrations'
import { hash } from './content.mjs'
import { parseOptions } from './server-options.mjs'
import { loadBundle, buildPlan, applyPlan } from './transfer.mjs'

process.umask(0o077)
globalThis.fetch = async () => { throw new Error('External requests are disabled during content import') }
let payload
try {
  const options = parseOptions(process.argv.slice(2), process.env)
  const bundle = await loadBundle(options.bundle)
  const mappings = JSON.parse(await readFile(options.mapping, 'utf8'))
  const approvedPlan = options.command === 'apply' ? JSON.parse(await readFile(options.plan, 'utf8')) : null
  if (approvedPlan) {
    const { sha256, ...data } = approvedPlan
    if (sha256 !== options['plan-sha256'] || hash(data) !== sha256 || !approvedPlan.target) throw new Error('Plan hash mismatch or missing server target identity')
  }
  const output = options.command === 'plan' ? options.out : options.receipt
  if (!(await stat(path.dirname(output))).isDirectory()) throw new Error('Output directory does not exist')
  try { await stat(output); throw new Error('Output file already exists; preserve earlier plans and receipts') }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  const mediaDir = path.resolve('media')
  if (!(await stat(mediaDir)).isDirectory()) throw new Error('The application media directory must be mounted')
  const config = await appConfig
  config.telemetry = false
  config.db = postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI }, push: false, disableCreateDatabase: true, migrationDir: path.resolve('src/migrations') })
  config.email = () => ({ name: 'disabled', defaultFromAddress: 'disabled@localhost', defaultFromName: 'Disabled', sendEmail: async () => { throw new Error('Email is disabled during content import') } })
  for (const collection of config.collections) {
    if (collection.upload) collection.upload.staticDir = collection.slug === 'media' ? mediaDir : path.resolve('private/cvs')
  }
  payload = await getPayload({ config })
  const applied = (await payload.db.pool.query('SELECT name FROM payload_migrations')).rows.map(row => row.name)
  const pending = migrations.filter(migration => !applied.includes(migration.name)).map(migration => migration.name)
  if (pending.length) throw new Error(`Database migrations must run before import: ${pending.join(', ')}`)
  const uri = new URL(process.env.DATABASE_URI)
  const actual = (await payload.db.pool.query('SELECT current_database() AS database, current_user AS role, inet_server_addr()::text AS "serverAddress", inet_server_port() AS "serverPort"')).rows[0]
  if (actual.database !== options['expect-database']) throw new Error('Connected database differs from the expected database')
  const targetIdentity = { environment: options.environment, origin: new URL(process.env.NEXT_PUBLIC_SERVER_URL).origin, host: uri.hostname, port: uri.port || '5432', ...actual }
  if (approvedPlan && hash(approvedPlan.target) !== hash(targetIdentity)) throw new Error('Connected server identity does not match the approved plan')
  if (options.command === 'plan') {
    const plan = await buildPlan(payload, bundle, mappings, undefined, targetIdentity)
    await writeFile(output, JSON.stringify(plan, null, 2), { flag: 'wx', mode: 0o600 })
    console.log(JSON.stringify({ plan: output, sha256: plan.sha256, target: targetIdentity, groupsToUpdate: plan.groups.filter(x => x.action === 'update').length, mediaToCreate: plan.assets.filter(x => x.action === 'create').length, settings: plan.settings }, null, 2))
  } else {
    await writeFile(output, JSON.stringify({ status: 'prepared', planHash: approvedPlan.sha256, target: targetIdentity }, null, 2), { flag: 'wx', mode: 0o600 })
    try {
      await applyPlan(payload, bundle, options.bundle, mappings, approvedPlan, output, { targetIdentity })
      console.log(JSON.stringify({ status: 'committed', receipt: output, target: targetIdentity }))
    } catch (error) {
      const receipt = JSON.parse(await readFile(output, 'utf8'))
      if (receipt.status === 'prepared') await writeFile(output, JSON.stringify({ ...receipt, status: 'failed-before-commit' }, null, 2))
      throw error
    }
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  if (payload) await payload.destroy()
}
process.exit(process.exitCode ?? 0)
