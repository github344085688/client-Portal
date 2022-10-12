'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const join = path.join
const basename = path.basename
const camel2Dash = require("camel-2-dash")
const transformerFactory = require('ts-import-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createESLintingRule = () => ({
  test: /\.(js)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const createTSLintingRule = () => ({
  test: /\.(ts)$/,
  loader: 'tslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.ts'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@components': resolve('src/components'),
      '@services': resolve('src/services'),
      '@shared': resolve('src/shared'),
      '@assets': resolve('src/assets'),
      '@panelComponents': resolve('src/modules/control-panel/panel-components'),
      '@modules': resolve('src/modules')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createESLintingRule(),createTSLintingRule()] : []),
      
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          getCustomTransformers: () => ({
            before: [
              transformerFactory({
                libraryName: 'element-ui',
                libraryDirectory: 'lib',
                camel2DashComponentName: true,
                style: (path) =>
                  join('element-ui', 'lib', 'theme-chalk', `${camel2Dash(basename(path, '.js'))}.css`),
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        }
      }
      ,{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*$|$)/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
