import type { Config } from 'jest'

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/projects'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular|rxjs|@angular-architects|@softarc)'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  moduleNameMapper: {
    '^@ops-board/shared-ui$': '<rootDir>/projects/shared-ui/src/public-api.ts',
    '\\.(scss|sass|css)$': '<rootDir>/__mocks__/styleMock.js'
  },
  collectCoverageFrom: [
    'projects/**/*.ts',
    '!projects/**/*.spec.ts',
    '!projects/**/main.ts',
    '!projects/**/bootstrap.ts',
    '!projects/**/federation.config.mjs',
    '!projects/shared-ui/src/public-api.ts'
  ]
}

export default config
