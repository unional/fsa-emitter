---
'fsa-emitter': major
---

Ship ESM only. The CommonJS build is gone.

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
