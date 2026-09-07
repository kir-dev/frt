import { build } from 'esbuild'

await build({
  entryPoints: ['scripts/career-transfer/server-cli.mjs'],
  outfile: 'scripts/.career-transfer/server.mjs',
  bundle: true, platform: 'node', format: 'esm', packages: 'external',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
})
