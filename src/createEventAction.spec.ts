import test from 'ava'

import { createEventAction, Emitter, createScopedCreateEventAction } from './index'

test('no input', t => {
  const noInput = createEventAction('noInput', () => emit => {
    emit(undefined)
  })

  const emitter = new Emitter()
  emitter.on(noInput, (payload) => {
    t.is(payload, undefined)
  })

  noInput(emitter, undefined, undefined)
})

test('no emit', t => {
  const noEmit = createEventAction('noEmit', () => () => { return })
  const emitter = new Emitter()
  emitter.on(noEmit, () => {
    t.fail('not called')
  })
  noEmit(emitter, undefined, undefined)
  t.pass()
})

test('create event action', t => {
  const minus = createEventAction<{ a: number, b: number }, { a: number, b: number, result: number }>('minus', ({ a, b }) => emit => {
    emit({ a, b, result: a + b })
  })

  t.plan(3)
  const emitter = new Emitter()
  emitter.on(minus, ({ a, b, result }) => {
    t.is(a, 1)
    t.is(b, 2)
    t.is(result, 3)
  })

  minus(emitter, { a: 1, b: 2 }, undefined)
})

test('create scoped createEventAction()', t => {
  const cva = createScopedCreateEventAction('a')
  const minus = cva('minus', () => () => { return })
  t.is(minus.type, 'a/minus')
})

test('match should type guard an action', t => {
  const noop = createEventAction('noop', () => () => { return })
  const event = { type: 'noop', payload: undefined, meta: undefined }

  t.true(noop.match(event))
})
