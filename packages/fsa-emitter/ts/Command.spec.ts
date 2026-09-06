import t from 'node:assert'
import { AssertOrder } from 'assertron'
import type { Emitter } from './Emitter.js'

import { Command, createEvent, TestEmitter } from './index.js'

test('Command provides emitter to subclass', () => {
	const event = createEvent('event')
	class TestCommand extends Command {
		run() {
			this.emitter.emit(event(undefined, undefined))
		}
	}

	const order = new AssertOrder(1)
	const emitter = new TestEmitter()
	const command = new TestCommand(emitter)
	emitter.addListener(event, () => order.once(1))
	command.run()
	order.end()
})

test('Command specifying additional context', () => {
	class TestCommand extends Command {
		constructor(
			emitter: Emitter,
			public foo: string
		) {
			super(emitter)
		}
		run() {
			this.emitter.emit({ type: 'e', payload: this.foo, error: false, meta: undefined })
		}
	}
	const emitter = new TestEmitter()
	const command = new TestCommand(emitter, 'foo')
	emitter.on('e', (foo) => {
		t.strictEqual(foo, 'foo')
	})
	command.run()
})
