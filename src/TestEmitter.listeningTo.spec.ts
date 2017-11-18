import { test } from 'ava';
import { TestEmitter, createEvent } from './index';

test('no event returns true', t => {
  const emitter = new TestEmitter()
  t.is(emitter.listenedTo([]), true)
  t.is(emitter.listenedTo({}), true)
})

test('not listened to event returns false', t => {
  const emitter = new TestEmitter()
  const c = createEvent('count')
  t.is(emitter.listenedTo([c]), false)
  t.is(emitter.listenedTo({ c }), false)
  t.is(emitter.listenedTo([c.type]), false)
})

test('check a listened to event returns true', t => {
  const emitter = new TestEmitter()
  const c = createEvent('count')
  const d = createEvent('dount')
  emitter.on(c, () => { return })
  emitter.on(d, () => { return })
  t.is(emitter.listenedTo([c]), true)
  t.is(emitter.listenedTo({ c }), true)
  t.is(emitter.listenedTo([c.type]), true)
})
