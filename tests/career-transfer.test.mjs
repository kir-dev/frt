import test from 'node:test'
import assert from 'node:assert/strict'
import { content, hash, mediaReferences, remapMedia, validateMapping } from '../scripts/career-transfer/content.mjs'

test('row IDs are removed but question keys and rich-text metadata survive', () => {
  const doc = { formQuestions: [{ id: 'staging-row', key: 'stable', options: [{ id: 'option-row', key: 'yes' }] }], intro: { root: { id: 'rich-id', children: [] } } }
  const result = content(doc, 'settings')
  assert.equal(result.formQuestions[0].id, undefined)
  assert.equal(result.formQuestions[0].key, 'stable')
  assert.equal(result.formQuestions[0].options[0].id, undefined)
  assert.equal(result.formQuestions[0].options[0].key, 'yes')
  assert.equal(result.intro.root.id, 'rich-id')
})
test('staging controls application state and integration URLs, including cleared values', () => {
  const source = { spreadsheetUrl: 'https://example.test/sheet', applicationsOpen: false, applicationMode: 'googleForm', googleFormUrl: 'https://example.test/form', intro: {} }
  const result = content(source, 'settings')
  for (const key of ['spreadsheetUrl', 'applicationsOpen', 'applicationMode', 'googleFormUrl']) assert.equal(result[key], source[key])
  const cleared = content({ ...source, spreadsheetUrl: null, googleFormUrl: null }, 'settings')
  assert.equal(cleared.spreadsheetUrl, null)
  assert.equal(cleared.googleFormUrl, null)
  assert.equal(cleared.applicationsOpen, false)
})
test('cross-database mappings reject reused IDs and stale names', () => {
  const source = [{ id: 6, groupName: 'Önvezető' }, { id: 7, groupName: 'Mechanika' }]
  const target = [{ id: 12, groupName: 'Driverless' }, { id: 13, groupName: 'Mechanika' }]
  const mapping = [{ sourceID: 6, sourceName: 'Önvezető', targetID: 12, targetName: 'Driverless' }, { sourceID: 7, sourceName: 'Mechanika', targetID: 13, targetName: 'Mechanika' }]
  assert.doesNotThrow(() => validateMapping(source, target, mapping))
  assert.throws(() => validateMapping(source, target, [{ ...mapping[0], targetID: 6 }, mapping[1]]))
  assert.throws(() => validateMapping(source, target, [mapping[0], { ...mapping[1], targetID: 12 }]))
  assert.throws(() => validateMapping(source, target, [mapping[0]]))
  assert.throws(() => validateMapping(source, [...target, { id: 14, groupName: 'Extra' }], mapping), /Unmapped target groups/)
})
test('rich-text relationships are mapped explicitly and unknown collections fail', () => {
  const doc = { root: { children: [{ type: 'upload', relationTo: 'media', value: 985 }] } }
  assert.deepEqual([...mediaReferences(doc)], [985])
  assert.equal(remapMedia(doc, { 985: 992 }).root.children[0].value, 992)
  assert.throws(() => remapMedia(doc, {}))
  assert.throws(() => mediaReferences({ relationTo: 'users', value: 1 }))
})
test('fingerprints ignore object order but retain array order', () => {
  assert.equal(hash({ a: 1, b: 2 }), hash({ b: 2, a: 1 }))
  assert.notEqual(hash([1, 2]), hash([2, 1]))
})
