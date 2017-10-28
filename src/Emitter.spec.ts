import test from 'ava'

import { actionCreator, Emitter } from './index'

test('listener(action) is typed', t => {
  const emitter = new Emitter()
  const count = actionCreator<number>('count')

  emitter.addListener(count, action => {
    // action is of type FSA<number, undefined>
    t.is(action.payload, 1)
  })

  emitter.emit(count(1, undefined))
})

test('support Error action', t => {
  const emitter = new Emitter()
  const error = actionCreator<Error>('error')
  emitter.addListener(error, action => {
    t.is(action.payload.message, 'abc')
  })

  emitter.emit(error(new Error('abc'), undefined))
})

test('onceListener will listen once', t => {
  const emitter = new Emitter()
  const count = actionCreator<number>('count')

  t.plan(1)
  emitter.once(count, action => {
    t.is(action.payload, 1)
  })

  emitter.emit(count(1, undefined))
  emitter.emit(count(2, undefined))
})
