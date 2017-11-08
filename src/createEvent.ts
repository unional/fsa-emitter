import { FSA } from 'flux-standard-action'

export interface Event<Payload, Meta> {
  (payload: Payload, meta: Meta): FSA<Payload, Meta>
  type: string,
  match(action: FSA<any, any>): action is FSA<Payload, Meta>
}

function defaultIsError(payload) { return payload instanceof Error }

export function createEvent<Payload = undefined, Meta = undefined>(type, isError: ((payload: Payload) => boolean) | boolean = defaultIsError): Event<Payload, Meta> {
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
