import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOptions } from '../scripts/career-transfer/server-options.mjs'

const env = { DATABASE_URI: 'postgresql://app:local-password@postgres:5432/frt', PAYLOAD_SECRET: 'local-test-only', NEXT_PUBLIC_SERVER_URL: 'https://frtbme.hu' }
const common = ['--environment', 'production', '--expect-database', 'frt', '--expect-origin', 'https://frtbme.hu', '--bundle', '/transfer/bundle/bundle.json', '--mapping', '/transfer/mapping.json']
const plan = ['plan', ...common, '--out', '/transfer/plan.json']
const apply = ['apply', ...common, '--plan', '/transfer/plan.json', '--plan-sha256', 'a'.repeat(64), '--receipt', '/transfer/receipt.json']

test('server plan requires explicit database and application identity', () => {
  assert.equal(parseOptions(plan, env).command, 'plan')
  assert.throws(() => parseOptions(plan, { ...env, DATABASE_URI: 'postgresql://app:pass@postgres/other' }), /Database does not match/)
  assert.throws(() => parseOptions(plan, { ...env, NEXT_PUBLIC_SERVER_URL: 'https://staging.frtbme.hu' }), /origin does not match/)
})
test('server apply requires the exact reviewed plan hash', () => {
  assert.equal(parseOptions(apply, env)['plan-sha256'], 'a'.repeat(64))
  assert.throws(() => parseOptions(apply.filter((_, index) => ![apply.indexOf('--plan-sha256'), apply.indexOf('--plan-sha256') + 1].includes(index)), env), /Missing --plan-sha256/)
  assert.throws(() => parseOptions(apply.map(value => value === 'a'.repeat(64) ? 'yes' : value), env), /exact SHA-256/)
})
test('server runner rejects unexpected commands, duplicate flags and path collisions', () => {
  assert.throws(() => parseOptions(['migrate', ...common], env), /Usage/)
  assert.throws(() => parseOptions([...plan, '--environment', 'staging'], env), /duplicate option/)
  assert.throws(() => parseOptions(plan.map(value => value === '/transfer/plan.json' ? '/transfer/bundle/bundle.json' : value), env), /must be distinct/)
})
test('server identity cannot omit credentials or use an authenticated expected URL', () => {
  assert.throws(() => parseOptions(plan, { ...env, PAYLOAD_SECRET: '' }), /required/)
  assert.throws(() => parseOptions(plan.map(value => value === 'https://frtbme.hu' ? 'https://user:pass@frtbme.hu' : value), env), /origin does not match/)
})
