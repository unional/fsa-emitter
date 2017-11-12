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
  addListener<Payload, Meta>(
    event: TypedEvent<Payload, Meta> | string,
    listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    const type = typeof event === 'string' ? event : event.type
    if (type === errorEvent.type)
      return this.addErrorEventListener(listener)

    return this.emitter.addListener(type, listener)
  }

  protected addErrorEventListener<Payload, Meta>(listener: (payload: Payload, meta: Meta, error: boolean) => void): EventSubscription {
    return this.emitter.addListener(errorEvent.type, listener)
  }
}
