module.exports = function (wallaby) {
  return {
    'files': [
      { pattern: 'package.json', instrument: false },
      { pattern: 'tsconfig.*', instrument: false },
      { pattern: '__komondor__/**/*', instrument: false },
      'src/**/*.ts',
      '!src/**/*.spec.ts'
    ],
    'tests': [
      'src/**/*.spec.ts'
    ],
    'env': {
      'type': 'node'
    },
    compilers: {
      'src/**/*.ts': wallaby.compilers.typeScript({ module: 'commonjs' }),
    },
    hints: {
      allowIgnoringCoverageInTests: true,
      ignoreCoverage: /istanbul ignore next/
    },
    testFramework: 'ava'
  }
}