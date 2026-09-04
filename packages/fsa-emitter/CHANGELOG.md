# fsa-emitter

## 2.0.2

### Patch Changes

- 1878fd5: Build with tsdown instead of two `tsc` passes.
  
  Every published path is unchanged — `cjs/*.js`, `cjs/*.d.ts`, `esm/*.js` and their
  sourcemaps all land where they always have, and the public API is identical. The
  emitted JavaScript itself is now produced by rolldown rather than `tsc`, which is
  why this is a release rather than a no-op.
  
  The tarball also now contains the `ts/` sources. `files` had listed a `src`
  directory that has never existed in this repo, so the `.js.map` files shipped with
  nothing to resolve against.

## 2.0.1

### Patch Changes

- 74d42b2: Restore the version line to the published series.

  `package.json` still carried semantic-release's `0.0.0-development` placeholder, so the
  first changesets release bumped it to `0.0.0` and npm made that `latest` — ahead of the
  real `2.0.0` by dist-tag, behind it by semver. This publishes `2.0.1` and returns `latest`
  to the 2.x line.

## 0.0.0

### Patch Changes

- 0d480ad: Point `repository`, `homepage` and `bugs` at `cyberuni/fsa-emitter`.

  `repository` is read when generating provenance attestations, so it has to be correct
  at publish time — not merely correct in the repo.
