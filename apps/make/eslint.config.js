import { reactInternalConfig } from '@docs-front/eslint-config/react-internal';
import pluginRouter from '@tanstack/eslint-plugin-router';

/** @type {import("eslint").Linter.Config} */
export default [
  ...reactInternalConfig,
  {
    plugins: {
      '@tanstack/router': pluginRouter
    },
    rules: {
      '@tanstack/router/create-route-property-order': 'error'
    }
  }
];
