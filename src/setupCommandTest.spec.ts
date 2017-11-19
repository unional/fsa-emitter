import { test } from 'ava'

import { Command, setupCommandTest, TestEmitter } from './index'

test('provides a TestEmitter', t => {
  class TestCommand extends Command {
    run() {
      return
    }
  }
  const { emitter } = setupCommandTest(TestCommand)

  t.true(emitter instanceof TestEmitter)
})

test('setupCommandTest gets completion support for context', t => {
  class TestCommand extends Command<{ foo: string }> {
    foo: string
    run() {
      this.emitter.emit({ type: 'e', payload: this.foo, error: false, meta: undefined })
    }
  }

  const { command, emitter } = setupCommandTest(TestCommand, { foo: 'foo' })
  emitter.on('e', foo => {
    t.is(foo, 'foo')
  })
  command.run()
})
