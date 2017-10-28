import { FSA } from 'flux-standard-action'
import { EventEmitter, EventSubscription } from 'fbemitter'

import { ActionCreator } from './createActionCreator'

export class Emitter {
  private emitter: EventEmitter
  constructor() {
    this.emitter = new EventEmitter()
  }
  emit<Payload, Meta>({ type, payload, meta, error }: FSA<Payload, Meta>) {
    return this.emitter.emit(type as string, payload, meta, error)
  }
  addListener<Payload, Meta>(actionCreator: ActionCreator<Payload, Meta>, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.emitter.addListener(actionCreator.type, listener)
  }
  on<Payload, Meta>(actionCreator: ActionCreator<Payload, Meta>, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.addListener(actionCreator, listener)
  }
  once<Payload, Meta>(actionCreator: ActionCreator<Payload, Meta>, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.emitter.once(actionCreator.type, listener)
  }
}
