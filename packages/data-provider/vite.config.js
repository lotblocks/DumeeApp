import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'react-query/index': resolve(__dirname, 'src/react-query/index.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'es.js' : 'js';
        return `${entryName}.${extension}`;
      }
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        'dumee-data-provider'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tanstack/react-query': 'ReactQuery'
        }
      }
    },
    sourcemap: true,
    minify: 'terser'
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types'
    })
  ]
});