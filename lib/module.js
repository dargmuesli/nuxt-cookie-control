const path = require('path');

module.exports = function cookies (_options) {
  const defaultOptions = {
    ...this.options.cookies,
    component: path.resolve(__dirname, '../components/CookieControl.vue')
  }

  const options = Object.assign(defaultOptions, _options)

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-cookie-control.js',
    options
  })
}

module.exports.meta = require('../package.json')