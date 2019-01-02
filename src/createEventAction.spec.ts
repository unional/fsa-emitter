import t from 'assert'

import { createEventAction, Emitter, createScopedCreateEventAction } from './index'

test('no input', () => {
  const noInput = createEventAction('noInput', () => emit => {
    emit(undefined)
  })

  const emitter = new Emitter()
  emitter.on(noInput, (payload) => {
    t.strictEqual(payload, undefined)
  })

  noInput(emitter, undefined, undefined)
})

test('no emit', () => {
  const noEmit = createEventAction('noEmit', () => () => { return })
  const emitter = new Emitter()
  emitter.on(noEmit, () => {
    t.fail('not called')
  })
  noEmit(emitter, undefined, undefined)
})

test('create event action', () => {
  const minus = createEventAction<{ a: number, b: number }, { a: number, b: number, result: number }>('minus', ({ a, b }) => emit => {
    emit({ a, b, result: a + b })
  })

  let called = false
  const emitter = new Emitter()
  emitter.on(minus, ({ a, b, result }) => {
    t.strictEqual(a, 1)
    t.strictEqual(b, 2)
    t.strictEqual(result, 3)
    called = true
  })

  minus(emitter, { a: 1, b: 2 }, undefined)

  t.strictEqual(called, true)
})

test('create scoped createEventAction()', () => {
  const cva = createScopedCreateEventAction('a')
  const minus = cva('minus', () => () => { return })
  t.strictEqual(minus.type, 'a/minus')
})

test('match should type guard an action', () => {
  const noop = createEventAction('noop', () => () => { return })
  const event = { type: 'noop', payload: undefined, meta: undefined }

  t(noop.match(event))
})

// test('compose actions', () => {
//   const add = createEventAction<{ a: number, b: number }, { c: number }>('add', ({ a, b }) => emit => emit({ c: a + b }))

//   const multiply = createEventAction<{ a: number, b: number }>('multiply', ({ a, b }) => emitter => {
//     if (a === 1)

//       add(emitter, undefined, undefined)
//   })

//   const emitter = new Emitter()
//   multiply(emitter, { a: 3, b: 3 }, undefined)
// })
