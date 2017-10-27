# fsa-eventemitter

[![unstable][unstable-image]][unstable-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/unional/unpartial.svg)](https://greenkeeper.io/)

EventEmitter in FSA style.

When dealing with event, I find myself need to remember the name of the event,
and the parameters each event has.

The event emitter and the event consumer can be a completely different person.

This implicit knowledge coupling relies on communication and documentation that are prone to error,
and are not convenient.

This library will address that by emitting and consuming events using a standard format,
and provides a mechanism to make the event typed.


## Contribute

```sh
# right after fork
npm install

# begin making changes
npm run watch

```

[unstable-image]: http://badges.github.io/stability-badges/dist/unstable.svg
[unstable-url]: http://github.com/badges/stability-badges
[npm-image]: https://img.shields.io/npm/v/fsa-eventemitter.svg?style=flat
[npm-url]: https://npmjs.org/package/fsa-eventemitter
[downloads-image]: https://img.shields.io/npm/dm/fsa-eventemitter.svg?style=flat
[downloads-url]: https://npmjs.org/package/fsa-eventemitter
[travis-image]: https://img.shields.io/travis/unional/fsa-eventemitter.svg?style=flat
[travis-url]: https://travis-ci.org/unional/fsa-eventemitter
[coveralls-image]: https://coveralls.io/repos/github/unional/fsa-eventemitter/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/fsa-eventemitter
