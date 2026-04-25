import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'

export default [
    {
      input: 'src/index.ts',
      output: [
        {
          file: 'dist/index.js',
          format: 'cjs',
          sourcemap: true
        },
        {
          file: 'dist/index.es.js',
          format: 'es',
          sourcemap: true
        }
      ],
      external: [ 'fs', 'path', 'util', 'assert', 'constants', 'stream', 'os' ],
      plugins: [
        external(),
        url(),
        typescript(),
        resolve(),
        commonjs()
      ]
    },
    {
      input: 'src/assets/index.tsx',
      output: [
        {
          file: 'dist/assets/bundle.js',
          format: 'iife',
          sourcemap: true
        }
      ],
      plugins: [
        external(),
        url(),
        resolve({ dedupe: ['react', 'react-dom'] }),
        typescript(),
        postcss(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true
        }),
        commonjs()
      ]
    }
  ]
