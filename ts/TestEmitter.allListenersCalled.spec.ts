import t from 'assert'

import { TestEmitter, errorEvent, createEvent } from './index'


test('true when no listener', () => {
  const emitter = new TestEmitter()

  t(emitter.allListenersCalled())
})

test('false when listener defined but not triggered', () => {
  const emitter = new TestEmitter()
  emitter.on(errorEvent, () => ({}))

  t(!emitter.allListenersCalled())
})


test('true when 1 listener defined and triggered', () => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')
  emitter.on(count, () => ({}))

  emitter.emit(count(1, undefined))

  t(emitter.allListenersCalled())
})

test(`false when 2 listeners dfeind but only 1 triggered`, () => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')
  const bound = createEvent<number>('bound')
  emitter.on(count, () => ({}))
  emitter.on(bound, () => ({}))

  emitter.emit(count(1, undefined))

  t(!emitter.allListenersCalled())

  emitter.emit(bound(1, undefined))

  t(emitter.allListenersCalled())
})
