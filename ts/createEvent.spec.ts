import t from 'assert'
import { isFSA, isError } from 'flux-standard-action'

import { createEvent, createScopedCreateEvent } from './index'

test('empty eventCreator creates FSA compliant action', () => {
  const beep = createEvent('beep')

  // want undefined parameters optional
  // waiting for https://github.com/Microsoft/TypeScript/issues/12400
  t(isFSA(beep(undefined, undefined)))
})

test('eventCreator with payload creates FSA compliant action', () => {
  const count = createEvent<number>('count')
  t(isFSA(count(1, undefined)))
})

test('eventCreator with payload and meta creates FSA compliant action', () => {
  const withMeta = createEvent<number, string>('withMeta')
  t(isFSA(withMeta(2, 'abc')))
})

test('Error payload creates Error FSA', () => {
  const withMeta = createEvent<Error, string>('withMeta')
  t(isError(withMeta(new Error('err'), 'abc')))
})

test('isError: true to create Error FSA', () => {
  const customError = createEvent<{ x: number, err: Error }>('customError', true)
  t(isError(customError({ x: 1, err: new Error() }, undefined)))
})

test(`isError predicate to create Error FSA`, () => {
  const mayError = createEvent<{ x: number, err?: Error }>('mayError', (payload) => !!payload.err)
  t(!isError(mayError({ x: 1 }, undefined)))
  t(isError(mayError({ x: 1, err: new Error() }, undefined)))
})

test('match should type guard an action', () => {
  const withMeta = createEvent<{ a: string }>('withMeta')
  const action = withMeta({ a: 'a' }, undefined)

  if (withMeta.match(action)) {
    // `payload.a` is properly typed as `string`
    t.strictEqual(action.payload!.a, 'a')
  }
})

test('createScopedCreateEventFunction will create <scope>/X event', () => {
  const createScope = createScopedCreateEvent('a')
  const ab = createScope('x')
  t.strictEqual(ab.type, 'a/x')
  t(isFSA(ab(undefined, undefined)))
})
