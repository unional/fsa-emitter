import merge = require('lodash.merge')

import { Emitter } from './Emitter'

// import { LogPresenter, HelpPresenter } from './Presenter'

// export interface ViewContext {
//   ui: LogPresenter & HelpPresenter
// }

// export type ViewBuilder<Context extends ViewContext = ViewContext> = (emitter: Emitter, context: Context) => void
export interface CommandContext {
  emitter: Emitter
}

export type CommandConstructor<Context extends CommandContext = CommandContext, Cmd extends Command<Context> = Command<Context>> = new (context: Context) => Cmd

/**
 * Task to run pure logic.
 * Communication to UI is done through emitter.
 */
export abstract class Command<Context = any> {
  protected emitter!: Emitter
  constructor(context: Context & CommandContext) {
    merge(this, context)
  }

  /**
   * Overrides this method with the calling signature of your task.
   * @param args some arguments
   */
  abstract run(...args: any[]): void | Promise<any>
}

// export function createTaskRunner<T extends Task, VC extends ViewContext = ViewContext>(context: VC, Task: TaskConstructor<T>, emitterBuilder: ViewBuilder<VC> = () => { return }) {
//   const emitter = new Emitter()
//   emitterBuilder(emitter, context)

//   return {
//     run(...args: any[]) {
//       try {
//         const task = new Task({ emitter })
//         return task.run(...args)
//       }
//       catch (e) {
//         // istanbul ignore next
//         context.ui.error(e)
//       }
//     }
//   } as T
// }
