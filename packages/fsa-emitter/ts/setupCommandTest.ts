import type { Command } from './Command.js'
import type { Emitter } from './Emitter.js'
import { TestEmitter } from './TestEmitter.js'

export function setupCommandTest<Cmd extends Command, Args extends any[]>(
	Command: new (emitter: Emitter, ...args: Args) => Cmd,
	...args: Args
) {
	const emitter = new TestEmitter()
	const command = new Command(emitter, ...args)
	return { emitter, command }
}
