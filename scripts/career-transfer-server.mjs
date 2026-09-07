import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// Inherit only DB and application identity, never integration credentials or .env loading.
const env = Object.fromEntries(['PATH', 'HOME', 'TMPDIR', 'DATABASE_URI', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL'].flatMap(key => process.env[key] === undefined ? [] : [[key, process.env[key]]]))
Object.assign(env, { NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' })
const result = spawnSync(process.execPath, ['--import', './css-loader-register.mjs', './scripts/.career-transfer/server.mjs', ...process.argv.slice(2)], { cwd: root, env, stdio: 'inherit' })
process.exitCode = result.status ?? 1
