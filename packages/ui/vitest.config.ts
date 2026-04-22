import { defineConfig } from 'vitest/config';
import { sharedConfig } from '@docs-front/vitest-config';
 
export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
  }
});