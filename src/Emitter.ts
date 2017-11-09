import { FSA } from 'flux-standard-action'
import { EventEmitter, EventSubscription } from 'fbemitter'

import { TypedEvent } from './createEvent'
import { errorEvent } from './errorEvent'

export class Emitter {
  private emitter: EventEmitter
  constructor() {
    this.emitter = new EventEmitter()
  }
  emit<Payload, Meta>({ type, payload, meta, error }: FSA<Payload, Meta>) {
    return this.emitter.emit(type as string, payload, meta, error)
  }
  addListener<Payload, Meta>(
    actionCreator: TypedEvent<Payload, Meta> | string,
    listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const type = typeof actionCreator === 'string' ? actionCreator : actionCreator.type
    if (type === errorEvent.type)
      return this.addErrorEventListener(listener)

    const wrappedListener = (payload, meta, error) => {
      try {
        listener(payload, meta, error)
      }
      catch (err) {
        this.emit(errorEvent(err, undefined))
      }
    }
    return this.emitter.addListener(type, wrappedListener)
  }
  on<Payload, Meta>(actionCreator: TypedEvent<Payload, Meta> | string, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.addListener(actionCreator, listener)
  }
  once<Payload, Meta>(actionCreator: TypedEvent<Payload, Meta> | string, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const type = typeof actionCreator === 'string' ? actionCreator : actionCreator.type
    return this.emitter.once(type, listener)
  }

  private addErrorEventListener<Payload, Meta>(listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const wrappedListener = (payload, meta, error) => {
      try {
        listener(payload, meta, error)
      }
      catch (err) {
        console.error('Error thrown in error event handler:', err)
      }
    }
    return this.emitter.addListener(errorEvent.type, wrappedListener)
  }
}
