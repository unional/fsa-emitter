import { Emitter } from './Emitter';
import { TypedEvent } from './createEvent';
import { EventSubscription } from 'fbemitter';
import { errorEvent } from './errorEvent';

/**
 * Emitter used for testing.
 * The real emitter will capture the error thrown in listener and send it to console.error.
 * It is good for main code but not good for testing.
 */
export class TestEmitter extends Emitter {
  private calledListeners: { [k: string]: boolean } = {}
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

  protected addErrorEventListener<Payload, Meta>(listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.emitter.addListener(errorEvent.type, listener)
  }
}
