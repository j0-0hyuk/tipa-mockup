// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  // esbuild loader를 설정합니다.
  loader: {
    '.svg': 'dataurl', // .svg 파일을 data URL로 변환
    '.png': 'dataurl', // .png 파일도 가능
    '.woff': 'file',
    '.woff2': 'file'
  }
});
