import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const baseConfig = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist', 'node_modules', 'vite.config.ts']
  },
  {
    plugins: {
      turbo: turboPlugin
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn'
    }
  },
  {
    files: ['**/*.{ts,tsx}']
  }
];
