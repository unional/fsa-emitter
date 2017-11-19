# FSA-Emitter

[![unstable][unstable-image]][unstable-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/unional/unpartial.svg)](https://greenkeeper.io/)

EventEmitter in FSA style.

When dealing with event, I find myself need to remember the name of the event,
and the parameters each event has.

The person who defines the events and the person who consumes the events can be two different person.

This implicit knowledge coupling relies on communication and documentation that are prone to error,
and are not convenient.

This library addresses this issue by emitting and consuming events using a standard format,
and provides provides IDE type support so they can be consumed easily.

## Emitter

`Emitter` will capture any error thrown in listener and send it to `console.error()`.
This is because the listener are UI code and any error thrown in there should not affact logic.

### createEvent<Payload, Meta>(type: string): Event<Payload, Meta>

Creates an event.

```ts
// count.ts
import { createEvent, Emitter } from 'fsa-emitter'

export const count = createEvent<number>('count')

// app.ts
export const emitter = new Emitter()

// logic.ts
import { emitter } from './app'
import { count } from './count'
emitter.emit(count(1))

// in UI
import { emitter } from './app'
import { count } from './count'
emitter.addListener(count, (payload) => {
  console.log('payload is typed and is a number: ', payload)
})

```

### createScopedCreateEvent(scope: string): <Payload, Meta>(subType: string) => Event<Payload, Meta>

Create scoped events

```ts
import { createScopedCreateEvent } from 'fsa-emitter'

const createEvent = createScopedCreateEvent('scope')

const count = createEvent<number>('count')

count.type // `scope/count`
```

### createEventAction<Input, Payload, Meta>(type: string, action: (input: Input) => emit => void): EventAction<Input, Payload, Meta>

Create an event action.

```ts
import { createEventAction, Emitter } from 'fsa-emitter'

const add = createEventAction<{ a: number, b: number }, { a: number, b: number, result: number }>('add', ({ a, b }) => emit => emit({ a, b, result: a + b }))

const emitter = new Emitter()

add(emitter, { a: 1, b: 2 }, undefined)
```

## Command

`Command` is a simple command pattern that provides a simple way to manage dependencies.

```ts
import { Command, createEvent, Emitter } from 'fsa-emitter'

const count = createEvent<{ n: number }>('count')

class CountCommand extends Command {
  run(n: number) {
    while (n) {
      this.emitter.emit(count({ n }, undefined))
      n--
    }
  }
}

const emitter = new Emitter()
const cmd = new CountCommand({ emitter })
cmd(10)
```

```ts
import { Command, createEvent, Emitter } from 'fsa-emitter'

const changeHeight = createEvent<{ height: number }>('changeHeight')
const landed = createEvent('landed')

class FlyCommand extends Command<{ fuel: number }> {
  fuel: number
  height = 0
  run() {
    while (this.fuel > 0) {
      this.height += 100
      this.fuel--
      this.emitter.emit(changeHeight({ height: this.height }, undefined))
    }
    const gliding = setInterval(() => {
      this.height -= 50
      this.emitter.emit(changeHeight({ height: this.height }, undefined))
      if (this.height <= 0) {
        this.emitter.emit(landed(undefined, undefined))
        clearInterval(gliding)
      }
    }, 100)
  }
}

// `fuel` is in the constructor context
const fly = new FlyCommand({ emitter: new Emitter(), fuel: 10 })
fly.run()
```

## TestEmitter

Same as `Emitter` but it will not capture error thrown in listeners.
`TestEmitter` can be used during testing to make your test easier to write.

## setupCommandTest(Command, context?)

`setupCommandTest()` is a simple helper to create a `TestEmitter` for the command to run with.
The same completion support is available as in the `Command` constructor.

```ts
import { Command, createEvent, setupCommandTest } from 'fsa-emitter'

const count = createEvent<{ n: number }>('count')

class CountCommand extends Command {
  ...
}

const { command, emitter } = setupCommandTest(CountCommand)

class FlyCommand extends Command<{ fuel: number }> {
  ...
}

// completion is available for `fuel`
const { command, emitter } = setupCommandTest(FlyCommand, { fuel: 10 })
```

### listenerCalled(event: TypedEvent | string): boolean

```ts
import { TestEmitter, createEvent } from 'fsa-emitter'

const emitter = new TestEmitter()
const count = createEvent<number>('count')
emitter.on(count, () => ({}))
t.false(emitter.listenerCalled(count))

emitter.emit(count(1, undefined))
t.true(emitter.listenerCalled(count))
t.true(emitter.listenerCalled(count.type))
```

### allListenersCalled(): boolean

```ts
import { TestEmitter, createEvent } from 'fsa-emitter'

const emitter = new TestEmitter()
const count = createEvent<number>('count')
const bound = createEvent<number>('bound')

emitter.on(count, () => ({}))
emitter.on(bound, () => ({}))

emitter.emit(count(1, undefined))

t.false(emitter.allListenersCalled())

emitter.emit(bound(1, undefined))

t.true(emitter.allListenersCalled())
```

### listenedTo(events: (TypedEvent | string)[] | { [k]: TypedEvent })

```ts
import { TestEmitter, createEvent } from 'fsa-emitter'

const emitter = new TestEmitter()
const count = createEvent<number>('count')
const bound = createEvent<number>('bound')

emitter.on(count, () => ({}))

emitter.listenedTo([count]) // true
emitter.listenedTo({ count }) // true
emitter.listenedTo(['count']) // true

emitter.listenedTo([ bound ]) // false
emitter.listenedTo({ bound }) // false
emitter.listenedTo([ 'bound' ]) // false

```

## Contribute

```sh
# right after fork
npm install

# begin making changes
npm run watch

```

[unstable-image]: http://badges.github.io/stability-badges/dist/unstable.svg
[unstable-url]: http://github.com/badges/stability-badges
[npm-image]: https://img.shields.io/npm/v/fsa-emitter.svg?style=flat
[npm-url]: https://npmjs.org/package/fsa-emitter
[downloads-image]: https://img.shields.io/npm/dm/fsa-emitter.svg?style=flat
[downloads-url]: https://npmjs.org/package/fsa-emitter
[travis-image]: https://img.shields.io/travis/unional/fsa-emitter/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/fsa-emitter?branch=master
[coveralls-image]: https://coveralls.io/repos/github/unional/fsa-emitter/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/fsa-emitter
