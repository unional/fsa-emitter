import type { Emitter } from './Emitter.js'

/**
 * Task to run pure logic.
 * Communication to UI is done through emitter.
 */
export abstract class Command {
	constructor(protected emitter: Emitter) {}

	/**
	 * Overrides this method with the calling signature of your task.
	 * @param args some arguments
	 */
	// biome-ignore lint/suspicious/noConfusingVoidType: `void` here is the published signature; narrowing it to `undefined` would reject subclasses whose run() returns a void-typed expression.
	abstract run(...args: any[]): void | Promise<any>
}
