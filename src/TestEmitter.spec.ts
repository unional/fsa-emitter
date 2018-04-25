import test from 'ava'

import { createEvent, TestEmitter, createEventAction, errorEvent } from './index'

test(`error thrown in listener is thrown`, t => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')

  emitter.on(count, () => { throw new Error('thrown') })

  const err = t.throws(() => emitter.emit(count(1, undefined)))
  t.is(err.message, 'thrown')
})

test('error thrown in listener is thrown for event action', t => {
  const emitter = new TestEmitter()
  const count = createEventAction<number, number>('count', input => emit => emit(input + 1))

  emitter.on(count, () => { throw new Error('thrown') })

  const err = t.throws(() => count(emitter, 1, undefined))
  t.is(err.message, 'thrown')
})

test(`error thrown in listener is thrown for string event`, t => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')

  emitter.on(count.type, () => { throw new Error('thrown') })

  const err = t.throws(() => emitter.emit(count(1, undefined)))
  t.is(err.message, 'thrown')
})

test('error thrown in listener is thrown for event action', t => {
  const emitter = new TestEmitter()
  const count = createEventAction<number, number>('count', input => emit => emit(input + 1))

  emitter.on(count, () => { throw new Error('thrown') })

  const err = t.throws(() => count(emitter, 1, undefined))
  t.is(err.message, 'thrown')
})

test('error thrown in listener is thrown for error event', t => {
  const emitter = new TestEmitter()

  emitter.on(errorEvent, () => {
    throw new Error('thrown')
  })

  const err = t.throws(() => emitter.emit(errorEvent(new Error('abc'), undefined)))
  t.is(err.message, 'thrown')
})

test('automatically listen to missed', t => {
  const emitter = new TestEmitter()

  t.is(emitter['listenMisses'].length, 1)
})
