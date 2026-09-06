export * from './Command.js'
export * from './createEvent.js'
export * from './createEventAction.js'
export * from './Emitter.js'
export * from './errorEvent.js'
export * from './setupCommandTest.js'
export * from './TestEmitter.js'

// This is commented out because likely this occurs in testing only and may be an issue with fbemitter.
// import { isNode } from './environment'

// We are using Emitter as store, just like redux.
// Expect to have many listeners.
// istanbul ignore next
// if (isNode)
//   process.setMaxListeners(0)
