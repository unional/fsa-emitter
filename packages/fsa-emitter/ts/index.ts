export * from './Command'
export * from './createEvent'
export * from './createEventAction'
export * from './Emitter'
export * from './errorEvent'
export * from './setupCommandTest'
export * from './TestEmitter'

// This is commented out because likely this occurs in testing only and may be an issue with fbemitter.
// import { isNode } from './environment'

// We are using Emitter as store, just like redux.
// Expect to have many listeners.
// istanbul ignore next
// if (isNode)
//   process.setMaxListeners(0)
