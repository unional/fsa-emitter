import { FSA } from 'flux-standard-action'

export interface Event<Payload, Meta> {
  (payload: Payload, meta: Meta): FSA<Payload, Meta>
  type: string,
  match(action: FSA<any, any>): action is FSA<Payload, Meta>
}

function defaultIsErrorPredicate(payload) { return payload instanceof Error }

export function createScopedCreateEventFunction(scope: string): typeof createEvent {
  return (type) => createEvent(`${scope}/${type}`)
}

export function createEvent<Payload = undefined, Meta = undefined>(type: string, isError: ((payload: Payload) => boolean) | boolean = defaultIsErrorPredicate): Event<Payload, Meta> {
  return Object.assign(
    (payload: Payload, meta: Meta) => {
      return isError && (typeof isError === 'boolean' || isError(payload)) ?
        { type, payload, meta, error: true } :
        { type, payload, meta }
    },
    {
      type,
      match(action): action is FSA<Payload, Meta> {
        return action.type === type
      }
    })
}
