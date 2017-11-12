import { test } from 'ava';

import { TestEmitter, errorEvent, createEvent } from './index';


test('true when no listener', t => {
  const emitter = new TestEmitter()

  t.true(emitter.allListenersCalled())
})

test('false when listener defined but not triggered', t => {
  const emitter = new TestEmitter()
  emitter.on(errorEvent, () => ({}))

  t.false(emitter.allListenersCalled())
})


test('true when 1 listener defined and triggered', t => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')
  emitter.on(count, () => ({}))

  emitter.emit(count(1, undefined))

  t.true(emitter.allListenersCalled())
})

test(`false when 2 listeners dfeind but only 1 triggered`, t => {
  const emitter = new TestEmitter()
  const count = createEvent<number>('count')
  emitter.on(count, () => ({}))

  const bound = createEvent<number>('bound')
  emitter.on(bound, () => ({}))

  emitter.emit(count(1, undefined))

  t.false(emitter.allListenersCalled())

  emitter.emit(bound(1, undefined))

  t.true(emitter.allListenersCalled())
})
