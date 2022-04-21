import t from 'assert'
import { Emitter } from './Emitter'

import { Command, setupCommandTest, TestEmitter } from './index'

test('provides a TestEmitter', () => {
  class TestCommand extends Command {
    run() {
      return
    }
  }
  const { emitter } = setupCommandTest(TestCommand)

  t(emitter instanceof TestEmitter)
})

test('setupCommandTest gets completion support for context', () => {
  class TestCommand extends Command {
    constructor(emitter: Emitter, public foo: string) {
      super(emitter)
    }
    run() {
      this.emitter.emit({ type: 'e', payload: this.foo, error: false, meta: undefined })
    }
  }

  const { command, emitter } = setupCommandTest(TestCommand, 'foo')
  emitter.on('e', foo => {
    t.strictEqual(foo, 'foo')
  })
  command.run()
})
