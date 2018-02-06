import test from 'ava'

import { createEvent, Emitter, errorEvent, createEventAction } from './index'

test('addListener(): listener(payload) is typed', t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  emitter.addListener(count, payload => {
    // payload: number
    t.is(payload, 1)
  })

  emitter.emit(count(1, undefined))
})

test('on()', t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  emitter.on(count, payload => {
    // payload: number
    t.is(payload, 1)
  })

  emitter.emit(count(1, undefined))
})

test('support Error action', t => {
  const emitter = new Emitter()
  const error = createEvent<Error>('error')
  emitter.addListener(error, ({ message }, _meta, error) => {
    t.is(message, 'abc')
    t.true(error)
  })

  emitter.emit(error(new Error('abc'), undefined))
})

test('onceListener will listen once', t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  t.plan(1)
  emitter.once(count, payload => {
    t.is(payload, 1)
  })

  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))
})

test('emit with meta gets meta in second param', t => {
  const emitter = new Emitter()
  const count = createEvent<number, { version: number }>('count')

  t.plan(2)
  emitter.once(count, (payload, meta) => {
    t.is(payload, 1)
    t.deepEqual(meta, { version: 3 })
  })

  emitter.emit(count(1, { version: 3 }))
  emitter.emit(count(2, { version: 3 }))
})

test(`error thrown in listener should not affect emitting code. An error action is emitted to capture the error so it will not be lost.`, t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  function noThrow() {
    try {
      emitter.emit(count(1, undefined))
    }
    catch {
      t.fail('should not throw')
    }
  }

  emitter.on(count, () => { throw new Error('thrown') })

  emitter.on(errorEvent, err => {
    t.is(err.message, 'thrown')
  })

  noThrow()
})

test('error thrown in errorAction handler should not cause call stack overflow', t => {
  const emitter = new Emitter()
  const count = createEventAction<number, number>('count', input => emit => emit(input + 1))

  function noThrow() {
    try {
      count(emitter, 1, undefined)
    }
    catch {
      t.fail('should not throw')
    }
  }

  emitter.on(count, () => { throw new Error('thrown') })

  // errorAction should not throw, it should be handled differently.
  emitter.on(errorEvent, () => {
    throw new Error('thrown in errorAction listener')
  })

  noThrow()
  t.pass()
})

test('listen using type string', t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')
  const minus = createEvent<number>('minus')
  const multiply = createEvent<{ a: number, b: number, result: number }>('multiply')
  emitter.on(count.type, (value) => {
    t.is(value, 1)
  })
  emitter.addListener(minus.type, (value) => {
    t.is(value, 2)
  })
  emitter.once(multiply.type, ({ a, b, result }) => {
    t.is(a, 2)
    t.is(b, 3)
    t.is(result, 6)
  })

  emitter.emit(count(1, undefined))
  emitter.emit(minus(2, undefined))
  emitter.emit(multiply({ a: 2, b: 3, result: 6 }, undefined))
})

test('queue() will invoked once and move to the next listener', t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')
  t.plan(2)
  emitter.queue(count, c => {
    t.is(c, 1)
  })
  emitter.queue('count', c => {
    t.is(c, 2)
  })
  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))
})

test('queue(): calling remove() on subscription will prevent it from invoking', t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  const sub = emitter.queue(count, () => {
    t.fail()
  })
  sub.remove()
  emitter.emit(count(1, undefined))
  t.pass()
})

test('queue(): calling remove() on queued subscription will prevent it from invoking', t => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  t.plan(1)
  emitter.queue(count, c => {
    t.is(c, 1)
  })
  const sub = emitter.queue(count, () => {
    t.fail()
  })
  sub.remove()
  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))
})
