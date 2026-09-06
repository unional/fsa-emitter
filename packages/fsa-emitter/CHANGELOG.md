# fsa-emitter

## 3.0.0

### Major Changes

- 8fd6935: Ship ESM only. The CommonJS build is gone.
  
  **What was removed**
  
  - The `cjs/` output is no longer built or published, and with it `main` and `typings`.
  - The published tarball now contains `esm/` only. The `ts/` sources are no longer shipped; the sourcemaps carry `sourcesContent`, so stepping into the library still shows the original TypeScript.
  
  **What replaces it**
  
  - `"type": "module"` plus an `exports` map with no `require` condition:
  
    ```json
    {
      ".": {
        "types": "./esm/index.d.ts",
        "default": "./esm/index.js"
      },
      "./package.json": "./package.json"
    }
    ```
  
  - Declarations now sit beside the JavaScript in `esm/`, where they never shipped before. The emitted file names in `esm/` are unchanged.
  
  **What consumers must do**
  
  - Import the package, do not `require` it. On Node 22.12 and later `require('fsa-emitter')` still works through Node's built-in support for requiring ESM; on older runtimes it throws `ERR_REQUIRE_ESM`. Move to `import` or dynamic `import()`.
  - Import from the package root. Deep imports such as `fsa-emitter/esm/Emitter.js` and `fsa-emitter/ts/Emitter` no longer resolve, because the `exports` map does not expose subpaths. Everything the package exported is re-exported from the root.
  - TypeScript consumers need a module resolution that reads `exports` — `node16`, `nodenext`, or `bundler`. The legacy `node` resolution finds no entry point, since `main` and `typings` are gone.

### Patch Changes

- 9c64c64: Declare a supported Node range: `^20.19.0 || ^22.13.0 || >=24`.
  
  Every version in that range has unflagged `require(esm)`, so a CommonJS consumer's
  `require()` of this now-ESM-only package resolves rather than throwing `ERR_REQUIRE_ESM`.
  Node 18 (EOL April 2025) and Node 20.0–20.18 are excluded because `require()` hard-fails there.

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
