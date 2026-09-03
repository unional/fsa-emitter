import { defineConfig } from 'tsdown'

const entry = ['ts/**/*.ts', '!ts/**/*.spec.ts']

/**
 * Two outputs, each pinned to the paths the package already publishes, so
 * replacing the two `tsc` passes with tsdown stays invisible to consumers:
 *
 * - `cjs/*.js` + `cjs/*.d.ts` — what `main` and `typings` point at.
 * - `esm/*.js` — the ESM build. It never shipped declarations and still does not;
 *   nothing in `package.json` references it, but it has been published since 1.x
 *   so deep imports keep resolving.
 *
 * Both are `unbundle`d, which is the per-module shape `tsc` emitted — the same
 * file names, so no published path moves.
 */
export default defineConfig([
	{
		entry,
		format: 'cjs',
		outDir: 'cjs',
		platform: 'neutral',
		unbundle: true,
		dts: true,
		sourcemap: true,
		outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
		clean: ['cjs']
	},
	{
		entry,
		format: 'esm',
		outDir: 'esm',
		platform: 'neutral',
		unbundle: true,
		dts: false,
		sourcemap: true,
		outExtensions: () => ({ js: '.js' }),
		clean: ['esm']
	}
])
