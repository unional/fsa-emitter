import { Emitter } from './Emitter'

/**
 * Task to run pure logic.
 * Communication to UI is done through emitter.
 */
export abstract class Command {
  constructor(protected emitter: Emitter) {
  }

  /**
   * Overrides this method with the calling signature of your task.
   * @param args some arguments
   */
  abstract run(...args: any[]): void | Promise<any>
}
