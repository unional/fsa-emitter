import test from 'ava'

import { createActionCreator, Emitter, errorAction } from './index'

test('addListener(): listener(payload) is typed', t => {
  const emitter = new Emitter()
  const count = createActionCreator<number>('count')

  emitter.addListener(count, payload => {
    // payload: number
    t.is(payload, 1)
  })

  emitter.emit(count(1, undefined))
})

test('on()', t => {
  const emitter = new Emitter()
  const count = createActionCreator<number>('count')

  emitter.on(count, payload => {
    // payload: number
    t.is(payload, 1)
  })

  emitter.emit(count(1, undefined))
})

test('support Error action', t => {
  const emitter = new Emitter()
  const error = createActionCreator<Error>('error')
  emitter.addListener(error, ({ message }, _meta, error) => {
    t.is(message, 'abc')
    t.true(error)
  })

  emitter.emit(error(new Error('abc'), undefined))
})

test('onceListener will listen once', t => {
  const emitter = new Emitter()
  const count = createActionCreator<number>('count')

  t.plan(1)
  emitter.once(count, payload => {
    t.is(payload, 1)
  })

  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))
})

test('emit with meta gets meta in second param', t => {
  const emitter = new Emitter()
  const count = createActionCreator<number, { version: number }>('count')

  t.plan(2)
  emitter.once(count, (payload, meta) => {
    t.is(payload, 1)
    t.deepEqual(meta, { version: 3 })
  })

  emitter.emit(count(1, { version: 3 }))
  emitter.emit(count(2, { version: 3 }))
})

test(`error thwon in listener should not affect emitting code. An error action is emitted to capture the error so it will not be lost.`, t => {
  const emitter = new Emitter()
  const count = createActionCreator<number>('count')

  function noThrow() {
    try {
      emitter.emit(count(1, undefined))
    }
    catch {
      t.fail('should not throw')
    }
  }

  emitter.on(count, () => { throw new Error('thrown') })

  emitter.on(errorAction, err => {
    t.is(err.message, 'thrown')
  })

  noThrow()

})
