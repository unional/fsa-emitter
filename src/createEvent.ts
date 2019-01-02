import { FSA } from 'flux-standard-action'

export interface TypedEvent<Payload, Meta> {
  type: string
  match(event: FSA<any, any>): event is FSA<Payload, Meta>
}

export interface Event<Payload, Meta> extends TypedEvent<Payload, Meta> {
  (payload: Payload, meta: Meta): FSA<Payload, Meta>
}

function defaultIsErrorPredicate(payload: any) { return payload instanceof Error }

export function createScopedCreateEvent(scope: string): typeof createEvent {
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
      match(event: { type: string }): event is FSA<Payload, Meta> {
        return event.type === type
      }
    })
}
