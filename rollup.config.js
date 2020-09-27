import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import json from '@rollup/plugin-json'
import postcss from "rollup-plugin-postcss";
import resolve from '@rollup/plugin-node-resolve'

const createConfig = (themeName) => ({
  input: `themes/${themeName}/index.js`,
  output: [
    {
      file: `dist/${themeName}.js`,
      format: 'umd',
      name: `${themeName}`,
    }
  ],
  external: false,
  treeshake: {
    propertyReadSideEffects: false,
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    resolve({
      mainFields: ['module', 'jsnext', 'main'],
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
      preferBuiltins: false,
    }),
    commonjs({
      include: /\/node_modules\//,
    }),
    postcss({
        extensions: [".css"],
        plugins: [
            require("tailwindcss")(`themes/${themeName}/tailwind.config.js`),
            require("autoprefixer"),
        ]
    }),
    json(),
    filesize(),
  ]
})

export default [
  'default',
].map(createConfig)
