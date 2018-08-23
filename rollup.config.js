import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'

export default [
    {
      input: 'src/index.ts',
      output: [
        {
          file: pkg.main,
          format: 'cjs',
          sourcemap: true
        },
        {
          file: pkg.module,
          format: 'es',
          sourcemap: true
        }
      ],
      external: [ 'fs', 'path', 'util', 'assert', 'constants', 'stream', 'os' ],
      plugins: [
        external(),
        url(),
        typescript({
          rollupCommonJSResolveHack: true
        }),
        resolve(),
        commonjs({
            namedExports: {
                'node_modules/fs-extra/lib/index.js': ['removeSync', 'mkdirSync', 'writeFileSync', 'copySync']
            }
        })
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
        resolve(),
        typescript({
          rollupCommonJSResolveHack: true
        }),
        postcss(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        commonjs({
            namedExports: {
                'node_modules/react-dom/index.js': ['render'],
                'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
                'node_modules/lodash/lodash.js': ['isEmpty', 'reject', 'upperFirst']
            }
        })
      ]
    }
  ]
