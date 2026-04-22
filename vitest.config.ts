import { defineConfig } from 'vitest/config';
import { sharedConfig } from '@docs-front/vitest-config';

export default defineConfig({
  test: {
    ...sharedConfig.test,
    projects: ['packages/*']
  }
});
