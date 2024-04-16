// TODO: move to own library (https://github.com/leanupjs/vite-plugin-replace/pull/2)
import type { Plugin } from 'vite'

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace
interface ViteReplacement {
  from: string | RegExp
  to: string | ((match: string) => string)
}

export interface VitePluginReplaceConfig {
  replacements: ViteReplacement[]
}

const execSrcReplacements = (src: string, replacements: ViteReplacement[]) => {
  for (const replacement of replacements) {
    if (
      (typeof replacement.from === 'string' ||
        replacement.from instanceof RegExp) === false
    ) {
      throw new TypeError(
        "[vite-plugin-replace]: The replacement option 'from' is not of type 'string' or 'RegExp'.",
      )
    } else if (
      (typeof replacement.to === 'string' ||
        replacement.to instanceof Function) === false
    ) {
      throw new TypeError(
        "[vite-plugin-replace]: The replacement option 'to' is not of type 'string' or 'Function'",
      )
    } else src = src.replace(replacement.from, replacement.to as string) // W3C - Function is allowed!
  }

  return src
}

export const replaceCodePlugin = (config: VitePluginReplaceConfig): Plugin => {
  if (config === undefined) {
    config = {
      replacements: [],
    }
  } else if ((typeof config === 'object' || config !== null) === false) {
    throw new TypeError(
      "[vite-plugin-replace]: The configuration is not of type 'Object'.",
    )
  } else if (Array.isArray(config.replacements) === false) {
    throw new TypeError(
      "[vite-plugin-replace]: The configuration option 'replacement' is not of type 'Array'.",
    )
  }

  return {
    name: 'transform-file',
    enforce: 'pre',
    transform: function (src: string) {
      return {
        code: execSrcReplacements(src, config.replacements),
        map: null,
      }
    },
  }
}
