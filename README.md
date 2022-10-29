# FSA Emitter

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![GitHub NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]
[![Visual Studio Code][vscode-image]][vscode-url]

`EventEmitter` in FSA style.

When dealing with event, I find myself need to remember the name of the event,
and the parameters each event has.

The person who defines the events and the person who consumes the events can be two different people.

This implicit knowledge coupling relies on communication and documentation that are prone to error,
and are not convenient.

This library addresses this issue by emitting and consuming events using a standard format,
and provides IDE type support, so they can be consumed easily.

[@unional/events-plus] is the spiritual successor of this package.
It works with multiple event emitters with similar API.
Feel free to check it out.

## Best practice

One of the benefits of using events is decoupling.
Here is one way to organize your code:

```ts
// app.ts
import { doWork } from './doWork'

const emitter = new Emitter()

doWork({ emitter })

// doWork.ts
import { createEvent, Emitter } from 'fsa-emitter'

export const count = createEvent<number>('count')

export function doWork({ emitter }) {
  emitter.emit(count(1, undefined))
}

// in UI
import { count } from './doWork'

emitter.on(count, payload => {
  console.log('payload is typed and is a number: ', payload)
})
```

## Installation

```sh
npm install fsa-emitter
```

## Emitter

`Emitter` uses [`FluxStandardAction`](https://github.com/acdlite/flux-standard-action) as the standard event format.

Another key difference between `Emitter` and NodeJS `EventEmitter` is that `Emitter` will capture any error thrown in listener and send it to `console.error()`.
This avoids any listener code throws error and break the event emitting logic.

To create event, use one of the helper methods below:

```ts
import {
  createEvent,
  createScopedCreateEvent,
  createEventAction,
  createScopedCreateEventAction,
  Emitter
} from 'fsa-emitter'

const count = createEvent<number>('count')

// create scoped event
const createMyModuleEvent = createScopedCreateEvent('myModule')
// `scopedCount` will emit FSA with `type: 'myModule/count'`
const scopedCount = createMyModuleEvent<number>('count')

const add = createAction<
  /* input */ { a: number, b: number },
  /* payload */ number>('add', ({ a, b }) => emit => emit(a + b))

// create scoped action
const createMyModuleAction = createScopedCreateEventAction('myModule')
// `scopedCountAction` will emit FSA with `type: 'myModule/add'`
const scopedAdd = createMyModuleAction<
  /* input */ { a: number, b: number },
  /* payload */ number>('add', ({ a, b }) => emit => emit(a + b))

const emitter = new Emitter()

emitter.emit(count(1, undefined))
emitter.emit(scopedCount(2, undefined))
add(emitter, { a: 1, b: 2 }, undefined)
scopedAdd(emitter, { a: 1, b: 2 }, undefined)
```

Note that due to <https://github.com/Microsoft/TypeScript/issues/12400>,
you need to supply `undefined` at where they expect `meta`.

To consume the event, use one of the following methods:

```ts
import { createEvent, Emitter } from 'fsa-emitter'

const count = createEvent<number>('count')
const emitter = new Emitter()

emitter.addListener(count, value => console.info(value))
emitter.on(count, value => console.info(value))

// Will only listen to the event once
emitter.once(count, value => console.info(value))

// line up in queue to listen for the event once
emitter.queue(count, value => console.info(value))

// listen to all events
emitter.onAny(fsa => console.info(fsa.type, fsa.payload))

// listen to any event that does not have a listener
emitter.onMissed(fsa => console.info(fsa.type, fsa.payload))
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

## `TestEmitter`

`TestEmitter` can be used as a drop-in replacement as `Emitter` during test.

The difference between `TestEmitter` and `Emitter` is that `TestEmitter` will not capture errors thrown in listeners.
This make it more suitable to use during testing so that you can detect any error thrown during the test.

Also, it provides some additional methods:

### `listenerCalled(event: TypedEvent | string): boolean`

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

### `allListenersCalled(): boolean`

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

### `listenedTo(events: (TypedEvent | string)[] | { [k]: TypedEvent })`

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

## `setupCommandTest(Command, context?)`

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

## Contribute

```sh
# after fork and clone
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

[@unional/events-plus]: https://github.com/unional/events-plus
[codecov-image]: https://codecov.io/gh/unional/fsa-emitter/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/fsa-emitter
[downloads-image]: https://img.shields.io/npm/dm/fsa-emitter.svg?style=flat
[downloads-url]: https://npmjs.org/package/fsa-emitter
[github-nodejs]: https://github.com/unional/fsa-emitter/workflows/nodejs/badge.svg
[github-action-url]: https://github.com/unional/fsa-emitter/actions
[npm-image]: https://img.shields.io/npm/v/fsa-emitter.svg?style=flat
[npm-url]: https://npmjs.org/package/fsa-emitter
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
