---
'fsa-emitter': patch
---

Build with tsdown instead of two `tsc` passes.

Every published path is unchanged — `cjs/*.js`, `cjs/*.d.ts`, `esm/*.js` and their
sourcemaps all land where they always have, and the public API is identical. The
emitted JavaScript itself is now produced by rolldown rather than `tsc`, which is
why this is a release rather than a no-op.

The tarball also now contains the `ts/` sources. `files` had listed a `src`
directory that has never existed in this repo, so the `.js.map` files shipped with
nothing to resolve against.
