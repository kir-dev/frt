import { createHash } from 'node:crypto'

const groupFields = ['groupName', 'groupNameEng', 'image', 'order', 'description', 'descriptionEng', 'positions']
const settingsFields = ['intro', 'introEng', 'applicationsClosedText', 'applicationsClosedTextEng', 'faqs', 'formQuestions', 'applicationMode', 'googleFormUrl', 'spreadsheetUrl', 'applicationsOpen']
const rowArrays = new Set(['positions', 'sections', 'faqs', 'formQuestions', 'options'])

// Strip Payload row IDs only, never IDs/keys embedded in rich text or question keys.
function clean(value, isRow = false) {
  if (Array.isArray(value)) return value.map(item => clean(item))
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).filter(([key]) => !(isRow && key === 'id')).map(([key, item]) => [key,
    rowArrays.has(key) && Array.isArray(item) ? item.map(row => clean(row, true)) : clean(item),
  ]))
}
export function content(doc, kind) {
  return clean(Object.fromEntries((kind === 'group' ? groupFields : settingsFields).map(key => [key, doc[key] ?? null])))
}
export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
}
export const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
export const fileHash = buffer => createHash('sha256').update(buffer).digest('hex')

export function mediaReferences(value, result = new Set()) {
  if (!value || typeof value !== 'object') return result
  if (value.relationTo) {
    if (value.relationTo !== 'media') throw new Error(`Unmapped rich-text relationship: ${value.relationTo}`)
    const id = typeof value.value === 'object' ? value.value?.id : value.value
    if (!Number.isInteger(id)) throw new Error('Invalid rich-text media reference')
    result.add(id)
  }
  for (const item of Object.values(value)) mediaReferences(item, result)
  return result
}
export function remapMedia(value, mapping) {
  if (Array.isArray(value)) return value.map(item => remapMedia(item, mapping))
  if (!value || typeof value !== 'object') return value
  const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, remapMedia(item, mapping)]))
  if (result.relationTo) {
    if (result.relationTo !== 'media') throw new Error(`Unsupported relationship: ${result.relationTo}`)
    const oldID = typeof result.value === 'object' ? result.value.id : result.value
    if (!mapping[oldID]) throw new Error(`Missing media mapping: ${oldID}`)
    result.value = mapping[oldID]
  }
  return result
}
export function validateMapping(source, target, mappings) {
  if (mappings.length !== source.length || new Set(mappings.map(x => x.sourceID)).size !== source.length) throw new Error('Every source group needs exactly one mapping')
  if (new Set(mappings.map(x => x.targetID)).size !== mappings.length) throw new Error('Target group mappings must be unique')
  if (target.some(doc => !mappings.some(mapping => mapping.targetID === doc.id))) throw new Error('Unmapped target groups require an explicit removal plan')
  for (const mapping of mappings) {
    const s = source.find(x => x.id === mapping.sourceID)
    const t = target.find(x => x.id === mapping.targetID)
    if (!s || !t || s.groupName !== mapping.sourceName || t.groupName !== mapping.targetName) throw new Error(`Group mapping no longer matches: ${mapping.sourceID} -> ${mapping.targetID}`)
  }
}
