import { FSA } from 'flux-standard-action'
import { TypedEvent } from './createEvent'
import { Emitter } from './Emitter'

export interface EventAction<Input = undefined, Payload = undefined, Meta = undefined> extends TypedEvent<Payload, Meta> {
  (emitter: Emitter, input: Input, meta: Meta): void,
}
export function createScopedCreateEventAction(scope: string): typeof createEventAction {
  return (type, action) => createEventAction(`${scope}/${type}`, action)
}

export function createEventAction<Input = undefined, Payload = undefined, Meta = undefined>(type: string, action: (input: Input) => (emit: (payload: Payload) => void) => void): EventAction<Input, Payload, Meta> {
  return Object.assign(
    (emitter: Emitter, input: Input, meta: Meta) => {
      function emit(payload: any) {
        emitter.emit({ type, payload, meta, error: false })
      }
      action(input)(emit)
    },
    {
      type,
      match(action: { type: string }): action is FSA<any, any, any> {
        return action.type === type
      }
    }
  )
}
