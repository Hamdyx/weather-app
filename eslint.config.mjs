import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextConfig from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['build/**', '.next/**', 'node_modules/**', 'next-env.d.ts']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextConfig,
  eslintConfigPrettier,
  // Error on any .js/.jsx source files — only TypeScript allowed
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['*.config.*', '*.mjs', '*.cjs'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            'JavaScript files are not allowed. Use TypeScript (.ts/.tsx) instead.',
        },
      ],
    },
  },
  {
    plugins: {
      'import-x': importPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', {}],

      // Enforce `import type { X }` instead of `import { type X }`
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],

      // Disallow .js/.jsx file extensions in imports — only .ts/.tsx allowed
      'import-x/extensions': [
        'error',
        'never',
        { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
      ],

      // Enforce import order with blank lines between groups:
      // 1. Type imports
      // 2. External packages (next, chakra, etc.)
      // 3. Aliased relative imports (@/...)
      // 4. Local relative imports (./)
      'import-x/order': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          sortTypesGroup: true,
          distinctGroup: false,
          'newlines-between': 'always',
          'newlines-between-types': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
);
