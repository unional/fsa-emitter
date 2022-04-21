import { createEvent } from './createEvent'

export const errorEvent = createEvent<Error>('fsa-emitter/error')
