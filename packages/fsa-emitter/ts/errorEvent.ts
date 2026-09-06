import { createEvent } from './createEvent.js'

export const errorEvent = createEvent<Error>('fsa-emitter/error')
