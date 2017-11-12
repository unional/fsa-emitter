import { test } from 'ava';

import { TestEmitter, errorEvent, createEvent } from './index';


test('false when listener not triggered', t => {
  const emitter = new TestEmitter()
  emitter.on(errorEvent, () => ({}))
  t.false(emitter.listenerCalled(errorEvent))
  t.false(emitter.listenerCalled(errorEvent.type))
})

test('true when listener triggered', t => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')
  emitter.on(count, () => ({}))
  t.false(emitter.listenerCalled(count))

  emitter.emit(count(1, undefined))
  t.true(emitter.listenerCalled(count))
  t.true(emitter.listenerCalled(count.type))
})
