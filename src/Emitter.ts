import { FSA } from 'flux-standard-action'
import { EventEmitter, EventSubscription } from 'fbemitter'

import { TypedEvent } from './createEvent'
import { errorEvent } from './errorEvent'

export class Emitter {
  protected emitter: EventEmitter
  protected eventQueues: { [k: string]: Function[] } = {}
  constructor() {
    this.emitter = new EventEmitter()
  }
  emit<Payload, Meta>({ type, payload, meta, error }: FSA<Payload, Meta>) {
    return this.emitter.emit(type as string, payload, meta, error)
  }

  addListener<Payload, Meta>(
    event: TypedEvent<Payload, Meta> | string,
    listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const type = typeof event === 'string' ? event : event.type
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
  on<Payload, Meta>(event: TypedEvent<Payload, Meta> | string, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.addListener(event, listener)
  }
  once<Payload, Meta>(event: TypedEvent<Payload, Meta> | string, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const type = typeof event === 'string' ? event : event.type
    return this.emitter.once(type, listener)
  }
  /**
   * Gets into a queue and listen to one event.
   */
  queue<Payload, Meta>(event: TypedEvent<Payload, Meta> | string, listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const type = typeof event === 'string' ? event : event.type
    const queue = this.eventQueues[type] = this.eventQueues[type] || []
    const wrap = (payload: Payload, meta: Meta, error: boolean) => {
      listener(payload, meta, error)
      queue.shift()
      if (queue.length > 0)
        this.emitter.once(type, queue[0])
    }

    queue.push(wrap)
    if (queue.length === 1)
      return this.emitter.once(type, wrap)
    else {
      return {
        listener: wrap,
        context: undefined,
        remove() {
          queue.splice(queue.indexOf(wrap), 1)
        }
      }
    }
  }

  protected addErrorEventListener<Payload, Meta>(listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
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
