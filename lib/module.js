const path = require('path');

module.exports = function cookies (_options) {
  const defaultOptions = {
    ...this.options.cookies,
    iframe: path.resolve(__dirname, '../components/CookieIframe.vue'),
    component: path.resolve(__dirname, '../components/CookieControl.vue'),
  }

  let options = Object.assign(defaultOptions, _options);

  if(options.blockIframe === true){
    options.necessary.push({
      name: 'functional'
    })

    this.extendBuild((config ) => {
      config.module.rules.push({
        test: /\.vue$/,
        loader: 'string-replace-loader',
        exclude: /node_modules/,
        options: {
          multiple: [
            { search: '<iframe', replace: '<CookieIframe' },
            { search: '</iframe>', replace: '</CookieIframe>' }
          ]
        }
      })
    })
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-cookie-control.js',
    options
  })
}

module.exports.meta = require('../package.json')