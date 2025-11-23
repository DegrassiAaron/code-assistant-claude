import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli/index.ts', 'src/core/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node'
  },
  target: 'node18'
});
