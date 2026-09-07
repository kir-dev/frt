import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

// This runner deliberately supports isolated local rehearsal databases only.
const database = process.argv[2]
if (!/^frt_transfer_(candidate|staging)$/.test(database ?? '')) {
  throw new Error('Usage: node scripts/career-transfer.mjs frt_transfer_{candidate|staging} <migrate|export|plan|apply|audit|verify-guards> [audit-filename.json]')
}
const root = path.resolve('.local-verification')
await mkdir(root, { recursive: true, mode: 0o700 })
const credentials = Object.fromEntries((await readFile(path.join(root, 'postgres.env'), 'utf8')).trim().split('\n').map(line => {
  const separator = line.indexOf('=')
  return [line.slice(0, separator), line.slice(separator + 1)]
}))
const uri = new URL(`postgresql://127.0.0.1:55441/${database}`)
uri.username = credentials.POSTGRES_USER
uri.password = credentials.POSTGRES_PASSWORD
const outfile = path.join(root, 'career-transfer-runner.mjs')
await build({
  entryPoints: ['scripts/career-transfer/cli.mjs'], outfile,
  bundle: true, platform: 'node', format: 'esm', packages: 'external',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
})
const result = spawnSync(process.execPath, ['--import', './css-loader-register.mjs', outfile, ...process.argv.slice(3)], {
  stdio: 'inherit',
  env: {
    PATH: process.env.PATH, HOME: process.env.HOME, TMPDIR: process.env.TMPDIR,
    NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
    DATABASE_URI: uri.href, PAYLOAD_SECRET: randomBytes(32).toString('hex'),
    FRT_TRANSFER_DATABASE: database, FRT_TRANSFER_ROOT: root,
    CV_STORAGE_DIR: path.join(root, database, 'private/cvs'),
  },
})
process.exitCode = result.status ?? 1
