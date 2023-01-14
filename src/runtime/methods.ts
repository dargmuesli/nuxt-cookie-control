import slugify from '@sindresorhus/slugify'

import { LOCALE_DEFAULT } from './constants'
import { Cookie, Translatable } from './types'

export const getCookieId = (cookie: Cookie) =>
  cookie.id || slugify(resolveTranslatable(cookie.name))

export const getCookieIds = (cookies: Cookie[]) =>
  cookies.map((cookie) => getCookieId(cookie))

export const useResolveTranslatable = (locale = LOCALE_DEFAULT) => {
  return (translatable: Translatable) =>
    resolveTranslatable(translatable, locale)
}

const resolveTranslatable = (
  translatable: Translatable,
  locale = LOCALE_DEFAULT
) => {
  if (typeof translatable === 'string') return translatable

  if (!locale)
    throw new Error('No locale given for translatable that is not a string.')

  const result = translatable[locale]

  if (!result)
    throw new Error(`Could not get translation for locale ${locale}.`)

  return result
}
