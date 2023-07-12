const execSrcReplacements = (src: any, replacements: any[]) => {
  for (const replacement of replacements) {
    if (
      (typeof replacement.from === 'string' ||
        replacement.from instanceof RegExp) === false
    ) {
      throw new TypeError(
        "[vite-plugin-replace]: The replacement option 'from' is not of type 'string' or 'RegExp'."
      )
    } else if (
      (typeof replacement.to === 'string' ||
        replacement.to instanceof Function) === false
    ) {
      throw new TypeError(
        "[vite-plugin-replace]: The replacement option 'to' is not of type 'string' or 'Function'"
      )
    } else src = src.replace(replacement.from, replacement.to)
  }

  return src
}

export const replaceCodePlugin = (config: any) => {
  if (config === undefined) {
    config = {
      replacements: [],
    }
  } else if ((typeof config === 'object' || config !== null) === false) {
    throw new TypeError(
      "[vite-plugin-replace]: The configuration is not of type 'Object'."
    )
  } else if (Array.isArray(config.replacements) === false) {
    throw new TypeError(
      "[vite-plugin-replace]: The configuration option 'replacement' is not of type 'Array'."
    )
  }

  return {
    name: 'transform-file',
    enforce: 'pre',
    transform: function (src: any) {
      return {
        code: execSrcReplacements(src, config.replacements),
        map: null,
      }
    },
  } as any
}
