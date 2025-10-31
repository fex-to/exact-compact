/* comments in English only */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'prettier', 'vitest'],
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vitest/recommended',
    'plugin:prettier/recommended', // keeps ESLint and Prettier in sync
    'prettier',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Imports
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
      },
    ],
    'import/no-unresolved': 'off', // TS handles it

    // Prettier
    'prettier/prettier': 'error',

    // Project-specific
    'no-console': 'warn',
    'no-debugger': 'error',
  },
  overrides: [
    // tests
    {
      files: ['tests/**/*.{ts,tsx}'],
      env: { 'vitest-globals/env': true },
      rules: {
        'no-console': 'off',
      },
    },
    // generated
    {
      files: ['i18n/**/*.ts', 'dist/**/*.ts'],
      rules: { 'prettier/prettier': 'off' },
    },
  ],
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    'node_modules/**',
    // generated locale packs:
    'i18n/**/*.ts',
  ],
};
