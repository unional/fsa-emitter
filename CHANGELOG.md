# fsa-emitter

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
