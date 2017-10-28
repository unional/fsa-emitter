import { FSA } from 'flux-standard-action'
import { EventEmitter, EventSubscription } from 'fbemitter'

import { ActionCreator, createActionCreator } from './createActionCreator'

export const errorAction = createActionCreator<Error>('fsa-emitter/error')

export class Emitter {
  private emitter: EventEmitter
  constructor() {
    this.emitter = new EventEmitter()
  }
  emit<Payload, Meta>({ type, payload, meta, error }: FSA<Payload, Meta>) {
    return this.emitter.emit(type as string, payload, meta, error)
  }
  addListener<Payload, Meta>(actionCreator: ActionCreator<Payload, Meta>, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const wrappedListener = (payload, meta, error) => {
      try {
        listener(payload, meta, error)
      }
      catch (err) {
        this.emit(errorAction(err, undefined))
      }
    }
    return this.emitter.addListener(actionCreator.type, wrappedListener)
  }
  on<Payload, Meta>(actionCreator: ActionCreator<Payload, Meta>, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.addListener(actionCreator, listener)
  }
  once<Payload, Meta>(actionCreator: ActionCreator<Payload, Meta>, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.emitter.once(actionCreator.type, listener)
  }
}
