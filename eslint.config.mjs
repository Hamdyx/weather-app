import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextConfig from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig(
  globalIgnores(['build/**', '.next/**', 'node_modules/**', 'next-env.d.ts']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextConfig,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', {}],
    },
  },
);
