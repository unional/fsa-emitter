import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		// `test` stays global, as it was under jest, so the specs need no per-file
		// imports and the migration touches no spec file.
		globals: true,
		environment: 'node',
		include: ['ts/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			include: ['ts/**/*.ts'],
			exclude: ['ts/**/*.spec.ts'],
			reporter: ['text', 'lcov'],
			// Pinned to what the suite already achieves, so a regression fails the
			// build instead of quietly showing up in a coverage report.
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100
			}
		}
	}
})
