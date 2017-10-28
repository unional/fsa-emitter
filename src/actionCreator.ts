import { FSA } from 'flux-standard-action'

export interface ActionCreator<Payload, Meta> {
  (payload: Payload, meta: Meta): FSA<Payload, Meta>
  type: string,
  match(action: FSA<any, any>): action is FSA<Payload, Meta>
}

export function actionCreator<Payload = undefined, Meta = undefined>(type): ActionCreator<Payload, Meta> {
  return Object.assign(
    (payload: Payload, meta: Meta) => {
      return payload instanceof Error ?
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
