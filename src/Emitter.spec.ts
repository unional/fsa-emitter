import t from 'assert'

import { createEvent, Emitter, errorEvent, createEventAction } from './index'

test('addListener(): listener(payload) is typed', () => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  emitter.addListener(count, payload => {
    // payload: number
    t.strictEqual(payload, 1)
  })

  emitter.emit(count(1, undefined))
})

test('on()', () => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  emitter.on(count, payload => {
    // payload: number
    t.strictEqual(payload, 1)
  })

  emitter.emit(count(1, undefined))
})

test('support Error action', () => {
  const emitter = new Emitter()
  const error = createEvent<Error>('error')
  emitter.addListener(error, ({ message }, _meta, error) => {
    t.strictEqual(message, 'abc')
    t(error)
  })

  emitter.emit(error(new Error('abc'), undefined))
})

test('onceListener will listen once', () => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  let called = 0
  emitter.once(count, payload => {
    t.strictEqual(payload, 1)
    ++called
  })

  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))

  t.strictEqual(called, 1)
})

test('emit with meta gets meta in second param', () => {
  const emitter = new Emitter()
  const count = createEvent<number, { version: number }>('count')

  let called = false
  emitter.once(count, (payload, meta) => {
    t.strictEqual(payload, 1)
    t.deepStrictEqual(meta, { version: 3 })
    called = true
  })

  emitter.emit(count(1, { version: 3 }))
  emitter.emit(count(2, { version: 3 }))
  t(called)
})

test(`error thrown in listener should not affect emitting code. An error action is emitted to capture the error so it will not be lost.`, () => {
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
    t.strictEqual(err.message, 'thrown')
  })

  noThrow()
})

test('error thrown in errorAction handler should not cause call stack overflow', () => {
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
    throw new Error('thrown in errorAction listener. Seeing this message during test run is expected')
  })

  noThrow()
})

test('listen using type string', () => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')
  const minus = createEvent<number>('minus')
  const multiply = createEvent<{ a: number, b: number, result: number }>('multiply')
  emitter.on(count.type, (value) => {
    t.strictEqual(value, 1)
  })
  emitter.addListener(minus.type, (value) => {
    t.strictEqual(value, 2)
  })
  emitter.once(multiply.type, ({ a, b, result }: { a: number, b: number, result: number }) => {
    t.strictEqual(a, 2)
    t.strictEqual(b, 3)
    t.strictEqual(result, 6)
  })

  emitter.emit(count(1, undefined))
  emitter.emit(minus(2, undefined))
  emitter.emit(multiply({ a: 2, b: 3, result: 6 }, undefined))
})

test('queue() will invoked once and move to the next listener', () => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  let called = 0
  emitter.queue(count, c => {
    t.strictEqual(c, 1)
    ++called
  })
  emitter.queue('count', c => {
    t.strictEqual(c, 2)
    ++called
  })
  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))

  t.strictEqual(called, 2)
})

test('queue(): calling remove() on subscription will prevent it from invoking', () => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  const sub = emitter.queue(count, () => {
    t.fail()
  })
  sub.remove()
  emitter.emit(count(1, undefined))
})

test('queue(): calling remove() on queued subscription will prevent it from invoking', () => {
  const emitter = new Emitter()
  const count = createEvent<number>('count')

  let called = 0
  emitter.queue(count, c => {
    t.strictEqual(c, 1)
    ++called
  })
  const sub = emitter.queue(count, () => {
    t.fail()
  })
  sub.remove()
  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))

  t.strictEqual(called, 1)
})

test('onAny() will listen to all events', () => {
  const emitter = new Emitter()

  let type = ''
  emitter.onAny(fsa => {
    type += fsa.type
  })

  emitter.emit({ type: 'x', payload: 1, meta: undefined })
  emitter.emit({ type: 'y', payload: 1, meta: undefined })

  t.strictEqual(type, 'xy')
})

test('onAny() returns subscription for removing itself', () => {
  const emitter = new Emitter()

  let type = ''
  const sub = emitter.onAny(fsa => {
    type += fsa.type
  })

  emitter.emit({ type: 'x', payload: 1, meta: undefined })
  sub.remove()
  emitter.emit({ type: 'y', payload: 1, meta: undefined })

  t.strictEqual(type, 'x')
})

test('onAny() returns subscription second remove is noop', () => {
  const emitter = new Emitter()

  let type = ''
  const sub = emitter.onAny(fsa => {
    type += fsa.type
  })

  emitter.emit({ type: 'x', payload: 1, meta: undefined })
  sub.remove()
  sub.remove()
  emitter.emit({ type: 'y', payload: 1, meta: undefined })

  t.strictEqual(type, 'x')
})

test('onMissed() listens to all not listened events', () => {
  const emitter = new Emitter()

  let type = ''
  emitter.onMissed(fsa => {
    type += fsa.type
  })
  emitter.on('x', () => { return })
  emitter.emit({ type: 'x', payload: 1, meta: undefined })
  emitter.emit({ type: 'y', payload: 1, meta: undefined })

  t.strictEqual(type, 'y')
})

test('onMiss() returns subscription for removing itself', () => {
  const emitter = new Emitter()

  let type = ''
  const sub = emitter.onMissed(fsa => {
    type += fsa.type
  })
  emitter.on('x', () => { return })
  emitter.emit({ type: 'x', payload: 1, meta: undefined })
  sub.remove()
  emitter.emit({ type: 'y', payload: 1, meta: undefined })

  t.strictEqual(type, '')
})

test('onMiss() returns subscription second remove is noop', () => {
  const emitter = new Emitter()

  let type = ''
  const sub = emitter.onMissed(fsa => {
    type += fsa.type
  })
  emitter.on('x', () => { return })
  emitter.emit({ type: 'x', payload: 1, meta: undefined })
  sub.remove()
  sub.remove()
  emitter.emit({ type: 'y', payload: 1, meta: undefined })

  t.strictEqual(type, '')
})
