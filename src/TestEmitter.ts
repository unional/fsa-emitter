import { tersify } from 'tersify'

import { TypedEvent } from './createEvent'
import { Emitter } from './Emitter'
import { errorEvent } from './errorEvent'
import { EventSubscription } from 'fbemitter'
import { FluxStandardAction } from 'flux-standard-action';

/**
 * Emitter used for testing.
 * The real emitter will capture the error thrown in listener and send it to console.error.
 * It is good for main code but not good for testing.
 */
export class TestEmitter extends Emitter {
  private calledListeners: { [k: string]: boolean } = {}
  constructor() {
    super()

    this.listenMisses.push(defaultMiss)
  }
  addListener<Payload, Meta>(
    event: TypedEvent<Payload, Meta> | string,
    listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const type = typeof event === 'string' ? event : event.type

    this.calledListeners[type] = false
    const wrap = (...args) => {
      this.calledListeners[type] = true;
      (listener as any)(...args)
    }
    if (type === errorEvent.type)
      return this.addErrorEventListener(wrap)
    return this.emitter.addListener(type, wrap)
  }
  listenerCalled(event: TypedEvent<any, any> | string) {
    const type = typeof event === 'string' ? event : event.type
    return this.calledListeners[type] === true
  }
  allListenersCalled(): boolean {
    return !Object.keys(this.calledListeners).some(t => !this.calledListeners[t])
  }
  listenedTo(events: (TypedEvent<any, any> | string)[] | { [k: string]: TypedEvent<any, any> }) {
    if (Array.isArray(events))
      return this.listenedToEventArray(events)
    else
      return this.listenedToEventMap(events)
  }
  onMissed(listener: (fsa: FluxStandardAction<any, undefined>) => void) {
    if (this.listenMisses.length === 1 && this.listenMisses[0] === defaultMiss) {
      this.listenMisses.splice(0, 1)
    }
    return super.onMissed(listener)
  }

  private listenedToEventArray(events: (TypedEvent<any, any> | string)[]) {
    const keys = Object.keys(this.calledListeners)
    if (events.length === 0) return true
    if (events.length >= keys.length) return false
    return events.every(event => {
      const type = typeof event === 'string' ? event : event.type
      return keys.some(k => k === type)
    })
  }

  private listenedToEventMap(events: { [k: string]: TypedEvent<any, any> }) {
    const keys = Object.keys(events)
    return this.listenedToEventArray(keys.map(k => events[k]))
  }

  protected addErrorEventListener<Payload, Meta>(listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.emitter.addListener(errorEvent.type, listener)
  }
}

function defaultMiss({ type, payload, meta }) {
  console.error(`missed event:
type: ${type}
payload: ${tersify(payload, { maxLength: Infinity })}
meta: ${tersify(meta)}`)
}
