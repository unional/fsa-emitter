import { test } from 'ava'
import { isFSA, isError, FSA } from 'flux-standard-action'

import { createEvent, createScopedCreateEvent } from './index'

test('empty eventCreator creates FSA compliant action', t => {
  const blip = createEvent('blip')

  // want undefined parameters optional
  // waiting for https://github.com/Microsoft/TypeScript/issues/12400
  t.true(isFSA(blip(undefined, undefined)))
})

test('eventCreator with payload creates FSA compliant action', t => {
  const count = createEvent<number>('count')
  t.true(isFSA(count(1, undefined)))
})

test('eventCreator with payload and meta creates FSA compliant action', t => {
  const withMeta = createEvent<number, string>('withMeta')
  t.true(isFSA(withMeta(2, 'abc')))
})

test('Error payload creates Error FSA', t => {
  const withMeta = createEvent<Error, string>('withMeta')
  t.true(isError(withMeta(new Error('err'), 'abc')))
})

test('isError: true to create Error FSA', t => {
  const customError = createEvent<{ x: number, err: Error }>('customError', true)
  t.true(isError(customError({ x: 1, err: new Error() }, undefined)))
})

test(`isError predicate to create Error FSA`, t => {
  const mayError = createEvent<{ x: number, err?: Error }>('mayError', (payload) => !!payload.err)
  t.false(isError(mayError({ x: 1 }, undefined)))
  t.true(isError(mayError({ x: 1, err: new Error() }, undefined)))
})

test('match should type guard an action', t => {
  const withMeta = createEvent<{ a: string }>('withMeta')
  const action = withMeta({ a: 'a' }, undefined)

  if (withMeta.match(action)) {
    // `payload.a` is properly typed as `string`
    t.is(action.payload.a, 'a')
  }
})

test('createScopedCreateEventFunction will create <scope>/X event', t => {
  const createScope = createScopedCreateEvent('a')
  const ab = createScope('x')
  t.is(ab.type, 'a/x')
  t.true(isFSA(ab(undefined, undefined)))
})
