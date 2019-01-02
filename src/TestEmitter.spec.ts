import t from 'assert'
import a from 'assertron'

import { createEvent, TestEmitter, createEventAction, errorEvent } from './index'

test(`error thrown in listener is thrown`, () => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')

  emitter.on(count, () => { throw new Error('thrown') })

  const err = a.throws(() => emitter.emit(count(1, undefined)))
  t.strictEqual(err.message, 'thrown')
})

test('error thrown in listener is thrown for event action', () => {
  const emitter = new TestEmitter()
  const count = createEventAction<number, number>('count', input => emit => emit(input + 1))

  emitter.on(count, () => { throw new Error('thrown') })

  const err = a.throws(() => count(emitter, 1, undefined))
  t.strictEqual(err.message, 'thrown')
})

test(`error thrown in listener is thrown for string event`, () => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')

  emitter.on(count.type, () => { throw new Error('thrown') })

  const err = a.throws(() => emitter.emit(count(1, undefined)))
  t.strictEqual(err.message, 'thrown')
})

test('error thrown in listener is thrown for event action', () => {
  const emitter = new TestEmitter()
  const count = createEventAction<number, number>('count', input => emit => emit(input + 1))

  emitter.on(count, () => { throw new Error('thrown') })

  const err = a.throws(() => count(emitter, 1, undefined))
  t.strictEqual(err.message, 'thrown')
})

test('error thrown in listener is thrown for error event', () => {
  const emitter = new TestEmitter()

  emitter.on(errorEvent, () => {
    throw new Error('thrown')
  })

  const err = a.throws(() => emitter.emit(errorEvent(new Error('abc'), undefined)))
  t.strictEqual(err.message, 'thrown')
})

test('automatically listen to missed', () => {
  const emitter = new TestEmitter()

  emitter.emit({ type: 'expected', payload: 'to see during test', meta: { somedata: 'good' } })

  t.strictEqual(emitter['listenMisses'].length, 1)
})

test('explicit onMissed() will remove default listener', () => {
  const emitter = new TestEmitter()
  emitter.onMissed(() => { return })
  t.strictEqual(emitter['listenMisses'].length, 1)
})

test('onMissed() twice, both get registered', () => {
  const emitter = new TestEmitter()
  let actual = ''
  emitter.onMissed(() => actual += 'a')
  emitter.onMissed(() => actual += 'b')
  emitter.emit({ type: 'x', payload: undefined, meta: undefined })
  t.strictEqual(actual, 'ab')
})
