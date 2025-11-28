import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: ['src/cli/index.ts', 'src/core/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node'
  },
  target: 'node18',
  onSuccess: async () => {
    // Copy Handlebars templates to dist
    const templatesDir = 'dist/core/execution-engine/mcp-code-api/templates';
    mkdirSync(templatesDir, { recursive: true });

    copyFileSync(
      'src/core/execution-engine/mcp-code-api/templates/typescript-wrapper.ts.hbs',
      join(templatesDir, 'typescript-wrapper.ts.hbs')
    );

    copyFileSync(
      'src/core/execution-engine/mcp-code-api/templates/python-wrapper.py.hbs',
      join(templatesDir, 'python-wrapper.py.hbs')
    );

    console.log('✓ Copied MCP templates to dist');
  }
});
