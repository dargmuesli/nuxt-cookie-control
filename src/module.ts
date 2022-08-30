import { ContextReplacementPlugin } from 'webpack'
const path = require('path')

module.exports = function cookies (_options) {
  const defaultOptions = {
    ...this.options.cookies,
    css: true,
    cssPolyfill: true,
    controlButton: true,
    barPosition: 'bottom-full',
    iframe: path.resolve(__dirname, '../components/CookieIframe.vue'),
    component: path.resolve(__dirname, '../components/CookieControl.vue')
  }

  const options = Object.assign(defaultOptions, _options)

  if (options.css) { this.options.css.push(path.resolve(__dirname, '../lib/styles.scss')) }
  if (this.options.globalName) { options.globalName = this.options.globalName }

  if (options.blockIframe) {
    const blockIframe = {
      name: 'functional',
      initialState: options.blockIframe.initialState !== undefined ? options.blockIframe.initialState : true
    }

    if (options.optional) { options.optional.push(blockIframe) } else { options.optional = [blockIframe] }

    this.extendBuild((config) => {
      config.module.rules.push({
        test: /\.vue$/,
        loader: 'string-replace-loader',
        exclude: /node_modules/,
        options: {
          multiple: [
            { search: '<iframe', replace: '<CookieIframe', flags: 'g' },
            { search: '</iframe>', replace: '</CookieIframe>', flags: 'g' }
          ]
        }
      })
    })
  }

  if (options.locales) {
    const regex = new RegExp(options.locales.join('|'))
    this.extendBuild((config) => {
      config.plugins.push(
        new ContextReplacementPlugin(/nuxt-cookie-control[\/\\]locale$/, regex)
      )
    })
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-cookie-control.js',
    options
  })

  // Nuxt-purgecss fix
  try {
    if (require.resolve('nuxt-purgecss').length > 0) {
      if (this.options.purgeCSS) {
        if (this.options.purgeCSS.whitelistPatternsChildren) { this.options.purgeCSS.whitelistPatternsChildren.push(/cookieControl/) } else { this.options.purgeCSS.whitelistPatternsChildren = [/cookieControl/] }
      } else {
        this.options.purgeCSS = {
          whitelistPatternsChildren: [/cookieControl/]
        }
      }
    }
  } catch (e) {}
}

module.exports.meta = require('../package.json')
