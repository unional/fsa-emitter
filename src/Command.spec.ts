import test from 'ava'
import { AssertOrder } from 'assertron'

import { Command, createEvent, TestEmitter } from './index'

test('Command provides emitter to subclass', t => {
  const event = createEvent('event')
  class TestCommand extends Command {
    run() {
      this.emitter.emit(event(undefined, undefined))
    }
  }

  const order = new AssertOrder(1)
  const emitter = new TestEmitter()
  const command = new TestCommand({ emitter })
  emitter.addListener(event, () => order.once(1))
  command.run()
  order.end()
  t.pass()
})

test('Command specifying additional context', t => {
  class TestCommand extends Command<{ foo: string }> {
    foo: string
    run() {
      this.emitter.emit({ type: 'e', payload: this.foo, error: false, meta: undefined })
    }
  }
  const emitter = new TestEmitter()
  const command = new TestCommand({ emitter, foo: 'foo' })
  emitter.on('e', foo => {
    t.is(foo, 'foo')
  })
  command.run()
})
