import { resolve } from 'path'
import { fileURLToPath } from 'url'

import {
  defineNuxtModule,
  isNuxt2,
  addPlugin,
  extendWebpackConfig,
  addWebpackPlugin,
  addTemplate,
} from '@nuxt/kit'
import webpack from 'webpack' // eslint-disable-line import/no-named-as-default

import { name, version } from '../package.json'
import { DEFAULTS, ModuleOptions } from './runtime/types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'cookieControl',
  },
  defaults: DEFAULTS,
  hooks: {
    'components:dirs'(dirs) {
      dirs.push({
        path: fileURLToPath(new URL('./runtime/components', import.meta.url)),
        prefix: 'cookie',
      })
    },
  },
  setup(moduleOptions, nuxt) {
    // const defaultOptions = {
    //   ...nuxt.options.cookies,
    //   iframe: path.resolve(__dirname, '../components/CookieIframe.vue'),
    //   component: path.resolve(__dirname, '../components/CookieControl.vue')
    // }
    // const options = Object.assign(defaultOptions, _options)

    if (moduleOptions.css) {
      nuxt.options.css.push(
        fileURLToPath(new URL('./runtime/styles.css', import.meta.url))
      )
    }

    if (moduleOptions.blockIframe) {
      const blockIframe = {
        name: 'functional',
        initialState:
          typeof moduleOptions.blockIframe !== 'boolean' &&
          moduleOptions.blockIframe.initialState !== undefined
            ? moduleOptions.blockIframe.initialState
            : true,
      }

      if (moduleOptions.cookies) {
        if (moduleOptions.cookies.optional) {
          moduleOptions.cookies.optional.push(blockIframe)
        } else {
          moduleOptions.cookies.optional = [blockIframe]
        }
      }

      extendWebpackConfig((config) => {
        config.module?.rules?.push({
          test: /\.vue$/,
          loader: 'string-replace-loader',
          exclude: /node_modules/,
          options: {
            multiple: [
              { search: '<iframe', replace: '<CookieIframe', flags: 'g' },
              { search: '</iframe>', replace: '</CookieIframe>', flags: 'g' },
            ],
          },
        })
      })
      // extendViteConfig(callback, options?)
    }

    if (moduleOptions.locales) {
      const regex = new RegExp(moduleOptions.locales.join('|'))
      addWebpackPlugin(
        new webpack.ContextReplacementPlugin(
          /nuxt-cookie-control[/\\]dist[/\\]runtime[/\\]locale$/,
          regex
        )
      )
      // addVitePlugin(vitePlugin, options?)
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, 'plugin'))
    nuxt.options.alias['#nuxtCookieControl'] = runtimeDir
    // nuxt.addPlugin({
    //   src: path.resolve(__dirname, 'plugin.js'),
    //   fileName: 'nuxt-cookie-control.js',
    //   options
    // })

    addTemplate({
      filename: 'nuxtCookieControl.options.ts',
      write: true,
      getContents: () =>
        `import { ModuleOptions } from '../../src/runtime/types'\n\nexport default ${JSON.stringify(
          moduleOptions,
          null,
          2
        )} as ModuleOptions`,
    })

    if (isNuxt2()) {
      // Nuxt-purgecss fix
      try {
        if (require.resolve('nuxt-purgecss').length > 0) {
          // @ts-ignore
          if (nuxt.options.purgeCSS) {
            // @ts-ignore
            if (nuxt.options.purgeCSS.whitelistPatternsChildren) {
              // @ts-ignore
              nuxt.options.purgeCSS.whitelistPatternsChildren.push(
                /cookieControl/
              )
            } else {
              // @ts-ignore
              nuxt.options.purgeCSS.whitelistPatternsChildren = [
                /cookieControl/,
              ]
            }
          } else {
            // @ts-ignore
            nuxt.options.purgeCSS = {
              whitelistPatternsChildren: [/cookieControl/],
            }
          }
        }
      } catch (e) {}
    }
  },
})
