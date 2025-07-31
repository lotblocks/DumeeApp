import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  define: {
    global: 'globalThis'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        return format === 'es' ? 'index.es.js' : 'index.js';
      }
    },
    rollupOptions: {
      external: [
        // Node.js built-ins
        'node:crypto',
        'node:path',
        'node:fs',
        'node:util',
        'crypto',
        'path',
        'fs',
        'util',
        'os',
        'stream',
        // External dependencies
        '@langchain/core',
        'axios',
        'diff',
        'eventsource',
        'js-yaml',
        'keyv',
        'dumee-data-provider',
        'node-fetch',
        'tiktoken',
        'undici',
        'zod'
      ]
    },
    sourcemap: true,
    minify: 'terser',
    target: 'node18',
    ssr: true
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types',
      include: ['src/**/*'],
      exclude: ['**/*.spec.ts', '**/*.test.ts']
    })
  ]
});