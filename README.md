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

## Usage

```ts
// count.ts
import { createActionCreator, Emitter } from 'fsa-emitter'

export const count = createActionCreator<number>('count')

// app.ts
export const emitter = new Emitter()

// logic.ts
import { emitter } from './app'
import { count } from './count'
emitter.emit(count(1))

// in UI
import { emitter } from './app'
import { count } from './count'
emitter.addListener(count, action => {
  console.log('payload is typed and is a number: ', action.payload)
})

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
[travis-image]: https://img.shields.io/travis/unional/fsa-emitter.svg?style=flat
[travis-url]: https://travis-ci.org/unional/fsa-emitter
[coveralls-image]: https://coveralls.io/repos/github/unional/fsa-emitter/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/fsa-emitter
