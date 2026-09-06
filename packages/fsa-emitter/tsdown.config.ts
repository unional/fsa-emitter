import { defineConfig } from 'tsdown'

const entry = ['ts/**/*.ts', '!ts/**/*.spec.ts']

/**
 * A single ESM output. The package dropped CJS in 3.0.
 *
 * `esm/` is kept as the output directory on purpose: it is the path this
 * package has published since 1.x, so every already-published deep import
 * (`fsa-emitter/esm/Emitter.js`) still points at a real file on disk. The
 * alternative — moving to `dist/` — would relocate every emitted file for no
 * gain, on top of a release that is already breaking.
 *
 * Declarations now come out beside the JS here, rather than from the CJS pass;
 * `exports` points at them. The output stays `unbundle`d, the per-module shape
 * `tsc` originally emitted, so the file names in `esm/` do not move.
 */
export default defineConfig({
	entry,
	format: 'esm',
	outDir: 'esm',
	platform: 'neutral',
	unbundle: true,
	dts: true,
	sourcemap: true,
	outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
	clean: ['esm']
})
