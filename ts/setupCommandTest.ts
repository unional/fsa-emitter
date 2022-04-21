import { Command } from './Command'
import { Emitter } from './Emitter'
import { TestEmitter } from './TestEmitter'

export function setupCommandTest<Cmd extends Command, Args extends any[]>(Command: new (emitter: Emitter, ...args: Args) => Cmd, ...args: Args) {
  const emitter = new TestEmitter()
  const command = new Command(emitter, ...args)
  return { emitter, command }
}
