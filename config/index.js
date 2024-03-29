'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
let apiHost = "http://stage.logisticsteam.com"
let wiseConfig= {}

if(process.argv[2] && process.argv[2].startsWith('env=')) {
  let wiseEnv = process.argv[2].split("=")[1]
  wiseConfig =  require('./wise/' + wiseEnv)
} else {
  wiseConfig = require('./wise/dev');
}

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/shared": apiHost,
      "/walnut": apiHost,
      "/viabaron": apiHost,
      "/valley": apiHost,
      "/cpapi": apiHost,
      "/fontana": apiHost,
      "/indiana": apiHost,
      "/morganlakes": apiHost,
      "/valleyview": apiHost,
      "/spring": apiHost
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
    "apiContextPath": wiseConfig.API_CONTEXT_PATH,
    "TMS_DOMAIN": wiseConfig.TMS_DOMAIN,
    'reportCenterPath': wiseConfig.REPORT_CENTER_PATH,
    "isPermissionDisabled": wiseConfig.isPermissionDisabled,
    'DEPOSIT_API_BASE_URL': wiseConfig.DEPOSIT_API_BASE_URL,
    'MESSAGE_URL': wiseConfig.MESSAGE_URL,
    'TMS_MESSAGE_URL': wiseConfig.TMS_MESSAGE_URL,
    "ssoRedirectLink": wiseConfig.ssoRedirectLink,
    'enableSaasMode': wiseConfig.enableSaasMode
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: wiseConfig.STATIC_CONTENT_CONTEXT_PATH ? wiseConfig.STATIC_CONTENT_CONTEXT_PATH : '/',

    // Google Analytics
    enableGoogleAnalytics: wiseConfig.enableGoogleAnalytics,

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report, 
    "apiContextPath": wiseConfig.API_CONTEXT_PATH,
    "TMS_DOMAIN": wiseConfig.TMS_DOMAIN,
    'reportCenterPath': wiseConfig.REPORT_CENTER_PATH,    // prod report-center api url
    "isPermissionDisabled": wiseConfig.isPermissionDisabled,
    'DEPOSIT_API_BASE_URL': wiseConfig.DEPOSIT_API_BASE_URL,
    'MESSAGE_URL': wiseConfig.MESSAGE_URL,
    'TMS_MESSAGE_URL': wiseConfig.TMS_MESSAGE_URL,
    'ssoRedirectLink': wiseConfig.ssoRedirectLink,
    'enableSaasMode': wiseConfig.enableSaasMode
  }
}
