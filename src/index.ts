export * from './createEvent'
export * from './createEventAction'
export * from './Emitter'
export * from './errorEvent'

import { isNode } from './environment'

// We are using Emitter as store, just like redux.
// Expect to have many listeners.
if (isNode)
  process.setMaxListeners(0)
