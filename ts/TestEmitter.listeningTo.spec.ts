import t from 'assert'
import { TestEmitter, createEvent } from './index'

test('no event returns true', () => {
  const emitter = new TestEmitter()
  t.strictEqual(emitter.listenedTo([]), true)
  t.strictEqual(emitter.listenedTo({}), true)
})

test('not listened to event returns false', () => {
  const emitter = new TestEmitter()
  const c = createEvent('count')
  t.strictEqual(emitter.listenedTo([c]), false)
  t.strictEqual(emitter.listenedTo({ c }), false)
  t.strictEqual(emitter.listenedTo([c.type]), false)
})

test('check a listened to event returns true', () => {
  const emitter = new TestEmitter()
  const c = createEvent('count')
  const d = createEvent('dount')
  emitter.on(c, () => { return })
  emitter.on(d, () => { return })
  t.strictEqual(emitter.listenedTo([c]), true)
  t.strictEqual(emitter.listenedTo({ c }), true)
  t.strictEqual(emitter.listenedTo([c.type]), true)
})
