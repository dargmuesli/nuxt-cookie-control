import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  defineNuxtModule,
  addPlugin,
  extendWebpackConfig,
  extendViteConfig,
  addTemplate,
  addImports,
  createResolver,
  resolvePath,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
// import webpack from 'webpack' // eslint-disable-line import/no-named-as-default

import { name, version } from '../package.json'
import { DEFAULTS, type ModuleOptions } from './runtime/types'
import { replaceCodePlugin } from './replace'

const resolver = createResolver(import.meta.url)
const runtimeDir = resolver.resolve('./runtime')

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'cookieControl',
    compatibility: { nuxt: '^3.0.0' },
  },
  defaults: DEFAULTS,
  hooks: {
    'components:dirs'(dirs) {
      dirs.push({
        path: resolver.resolve(runtimeDir, 'components'),
        prefix: 'cookie',
      })
    },
  },
  async setup(moduleOptions, nuxt) {
    nuxt.options.alias['#cookie-control/set-vars'] =
      moduleOptions.isCssPonyfillEnabled
        ? resolver.resolve(runtimeDir, 'set-vars/ponyfill')
        : resolver.resolve(runtimeDir, 'set-vars/native')

    nuxt.options.alias['#cookie-control'] = runtimeDir
    nuxt.options.build.transpile.push(runtimeDir)

    pushCss(moduleOptions, nuxt)
    blockIframes(moduleOptions)
    await loadLocales(moduleOptions)

    addPlugin(resolver.resolve(runtimeDir, 'plugin'))
    addImports({
      name: 'useCookieControl',
      as: 'useCookieControl',
      from: resolver.resolve(runtimeDir, 'composables'),
    })
    addTemplate({
      filename: 'cookie-control-options.ts',
      write: true,
      getContents: () =>
        `import type { ModuleOptions } from '#cookie-control/types'\n\nexport default ${JSON.stringify(
          moduleOptions,
          undefined,
          2,
        )} as ModuleOptions`,
    })
  },
})

const blockIframes = (moduleOptions: ModuleOptions) => {
  if (moduleOptions.isIframeBlocked) {
    const isIframeBlocked = {
      id: 'ncc_f',
      name: 'functional',
    }

    if (moduleOptions.cookies) {
      if (moduleOptions.cookies.optional) {
        moduleOptions.cookies.optional.push(isIframeBlocked)
      } else {
        moduleOptions.cookies.optional = [isIframeBlocked]
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

    extendViteConfig((config) => {
      config?.plugins?.push(
        replaceCodePlugin({
          replacements: [
            {
              from: /<iframe[^>]*.*|<\/iframe>/g,
              to: (match: string) =>
                match.includes('cookie-enabled')
                  ? match
                  : match
                      .replace(/<iframe/g, '<CookieIframe')
                      .replace(/iframe>/g, 'CookieIframe>'),
            },
          ],
        }),
      )
    })
  }
}

const loadLocales = async (moduleOptions: ModuleOptions) => {
  const locales = moduleOptions.locales

  moduleOptions.locales = []

  for (const locale of locales) {
    const text = await import(
      pathToFileURL(await resolvePath(resolve(runtimeDir, 'locale', locale)))
        .href
    ).then((r) => r.default || r)

    if (!text) throw new Error(`Could not import text for locale ${locale}`)

    moduleOptions.locales.push(locale)
    moduleOptions.localeTexts[locale] = {
      ...text,
      ...moduleOptions.localeTexts[locale],
    }
  }

  // const regex = new RegExp(moduleOptions.locales.join('|'))
  // addWebpackPlugin(
  //   new webpack.ContextReplacementPlugin(
  //     /nuxt-cookie-control[/\\]dist[/\\]runtime[/\\]locale$/,
  //     regex
  //   )
  // )
  // addVitePlugin(vitePlugin, options?)
}

const pushCss = (moduleOptions: ModuleOptions, nuxt: Nuxt) => {
  if (moduleOptions.isCssEnabled)
    nuxt.options.css.push(resolver.resolve(runtimeDir, 'styles.css'))
}
