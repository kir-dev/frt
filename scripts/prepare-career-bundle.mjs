import { spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileHash, hash, mediaReferences } from './career-transfer/content.mjs'

process.umask(0o077)
const [stagingArchive, productionArchive] = process.argv.slice(2)
if (!stagingArchive || !productionArchive) throw new Error('Pass staging and production file archives')
const root = path.resolve('.local-verification')
const source = JSON.parse(await readFile(path.join(root, 'frt_transfer_staging.json')))
const target = JSON.parse(await readFile(path.join(root, 'frt_transfer_candidate.json')))
const ids = mediaReferences([source.recruitment, source.settings])
source.recruitment.forEach(doc => { if (doc.image) ids.add(doc.image) })
const media = [...ids].map(id => {
  const doc = source.media.find(item => item.id === id)
  if (!doc?.filename || path.basename(doc.filename) !== doc.filename) throw new Error(`Invalid media file: ${id}`)
  return doc
})
const bundleDir = path.join(root, 'bundle')
await mkdir(bundleDir, { recursive: true })

async function extract(archive, destination, filenames) {
  await mkdir(path.join(destination, 'media'), { recursive: true })
  if (!filenames.length) return
  // Extract exact regular files ourselves; no paths or links from tar may escape destination.
  const python = `import tarfile,sys,os,shutil,json
names=set(json.loads(sys.argv[3])); found=set()
with tarfile.open(sys.argv[1], 'r|gz') as archive:
 for member in archive:
  if member.name in names:
   if not member.isfile() or member.name in found: raise RuntimeError('Invalid archive member')
   dest=os.path.join(sys.argv[2], member.name)
   with archive.extractfile(member) as src, open(dest, 'xb') as out: shutil.copyfileobj(src,out)
   found.add(member.name)
if found != names: raise RuntimeError('Missing archive members: '+str(names-found))
`
  const result = spawnSync('python3', ['-c', python, archive, destination, JSON.stringify(filenames.map(name => `media/${name}`))], { stdio: 'inherit' })
  if (result.status !== 0) throw new Error('Selective file extraction failed')
}
await extract(stagingArchive, bundleDir, media.map(doc => doc.filename))
const existing = target.media.filter(doc => media.some(s => s.filename === doc.filename))
await extract(productionArchive, path.join(root, 'frt_transfer_candidate'), existing.map(doc => doc.filename))
const assets = []
for (const doc of media) {
  const bytes = await readFile(path.join(bundleDir, 'media', doc.filename))
  if (bytes.length !== doc.filesize) throw new Error(`File size differs from DB: ${doc.filename}`)
  assets.push({ sourceID: doc.id, filename: doc.filename, alt: doc.alt, mimeType: doc.mimeType, size: bytes.length, sha256: fileHash(bytes) })
}
const bundle = { version: 1, recruitment: source.recruitment, settings: source.settings, assets }
bundle.sha256 = hash(bundle)
await writeFile(path.join(bundleDir, 'bundle.json'), JSON.stringify(bundle, null, 2))
console.log(JSON.stringify({ bundle: path.join(bundleDir, 'bundle.json'), files: assets.length, bytes: assets.reduce((n, x) => n + x.size, 0), sha256: bundle.sha256 }))
