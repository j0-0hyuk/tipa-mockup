import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig } from './base.js';

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const reactInternalConfig = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    }
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': reactRefresh
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['./*', '../*']
        }
      ]
    }
  }
];
