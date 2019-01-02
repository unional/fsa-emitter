import t from 'assert'

import { TestEmitter, errorEvent, createEvent } from './index';


test('false when listener not triggered', () => {
  const emitter = new TestEmitter()
  emitter.on(errorEvent, () => ({}))
  t(!emitter.listenerCalled(errorEvent))
  t(!emitter.listenerCalled(errorEvent.type))
})

test('true when listener triggered', () => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')
  emitter.on(count, () => ({}))
  t(!emitter.listenerCalled(count))

  emitter.emit(count(1, undefined))
  t(emitter.listenerCalled(count))
  t(emitter.listenerCalled(count.type))
})
