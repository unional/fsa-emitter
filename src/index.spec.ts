import test from 'ava'
import { FSA } from 'flux-standard-action'
import { actionCreator, ActionCreator } from './actionCreator';

export class Emitter {
  private actions = {}
  emit<Payload, Meta>(action: FSA<Payload, Meta>) {
    const callbacks = this.actions[action.type]
    if (callbacks)
      callbacks.forEach(cb => cb(action));
  }
  on<Payload, Meta>(actionCreator: ActionCreator<Payload, Meta>, cb: (action: FSA<Payload, Meta>) => void) {
    const callbacks = this.actions[actionCreator.type] || []
    callbacks.push(cb)
    this.actions[actionCreator.type] = callbacks
  }
}

test('create Emitter', t => {
  const emitter = new Emitter()
  const count = actionCreator<number>('count')

  emitter.on(count, action => {
    t.is(action.payload, 1)
  })

  emitter.emit(count(1, undefined))
})
