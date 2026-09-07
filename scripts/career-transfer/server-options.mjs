import path from 'node:path'

export function parseOptions(argv, env) {
  const [command, ...args] = argv
  if (!['plan', 'apply'].includes(command)) throw new Error('Usage: career-transfer-server.mjs <plan|apply> --environment <production|staging|rehearsal> --expect-database <name> --expect-origin <url> --bundle <file> --mapping <file> [--out <plan-file> | --plan <file> --plan-sha256 <hash> --receipt <file>]')
  const allowed = new Set(['environment', 'expect-database', 'expect-origin', 'bundle', 'mapping', ...(command === 'plan' ? ['out'] : ['plan', 'plan-sha256', 'receipt'])])
  const options = { command }
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.slice(2)
    if (!args[i]?.startsWith('--') || !allowed.has(key) || Object.hasOwn(options, key) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Invalid or duplicate option: ${args[i]}`)
    options[key] = args[i + 1]
  }
  for (const key of allowed) if (!options[key]) throw new Error(`Missing --${key}`)
  if (!['production', 'staging', 'rehearsal'].includes(options.environment)) throw new Error('Invalid environment')
  if (!env.DATABASE_URI || !env.PAYLOAD_SECRET || !env.NEXT_PUBLIC_SERVER_URL) throw new Error('DATABASE_URI, PAYLOAD_SECRET and NEXT_PUBLIC_SERVER_URL are required')
  const database = new URL(env.DATABASE_URI)
  if (!['postgres:', 'postgresql:'].includes(database.protocol)) throw new Error('PostgreSQL DATABASE_URI required')
  if (decodeURIComponent(database.pathname.slice(1)) !== options['expect-database']) throw new Error('Database does not match --expect-database')
  const expectedOrigin = new URL(options['expect-origin'])
  const origin = new URL(env.NEXT_PUBLIC_SERVER_URL)
  if (!['http:', 'https:'].includes(origin.protocol) || expectedOrigin.origin !== origin.origin || expectedOrigin.username || expectedOrigin.password || origin.username || origin.password) throw new Error('Application origin does not match --expect-origin')
  if (expectedOrigin.pathname !== '/' || expectedOrigin.search || expectedOrigin.hash) throw new Error('--expect-origin must contain only the origin')
  if (command === 'apply' && !/^[a-f0-9]{64}$/.test(options['plan-sha256'])) throw new Error('An exact SHA-256 plan hash is required')
  for (const key of ['bundle', 'mapping', 'out', 'plan', 'receipt']) if (options[key]) options[key] = path.resolve(options[key])
  const files = ['bundle', 'mapping', 'out', 'plan', 'receipt'].flatMap(key => options[key] ? [options[key]] : [])
  if (new Set(files).size !== files.length) throw new Error('Input and output paths must be distinct')
  return options
}
