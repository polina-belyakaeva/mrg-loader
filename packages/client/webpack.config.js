const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/packages/client'),
  },
  devServer: {
    port: 3001,
  },
  resolve: {
    alias: {
      react: join(__dirname, '../../node_modules/react'),
      'react-dom': join(__dirname, '../../node_modules/react-dom'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    modules: [join(__dirname, '../../node_modules'), 'node_modules'],
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'swc',
      main: './src/app/index.tsx',
      index: './src/index.html',
      // baseHref: '/',
      // assets: ['./src/favicon.ico', './src/assets'],
      // styles: ['./src/styles.css'],
      // outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      // optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
  ],
};
