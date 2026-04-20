import { LOCALE_DEFAULT } from '#cookie-control/constants'
import type { Cookie, ModuleOptions, Translatable } from '#cookie-control/types'
import { useCookie } from '#imports'

export const getAllCookieIdsString = (moduleOptions: ModuleOptions) =>
  getCookieIds([
    ...moduleOptions.cookies.necessary,
    ...moduleOptions.cookies.optional,
  ]).join('')

export const getCookieIds = (cookies: Cookie[]) =>
  cookies.map((cookie) => cookie.id)

export const removeCookie = (name: string) =>
  (useCookie(name).value = undefined)

export const resolveTranslatable = (
  translatable: Translatable,
  locale = LOCALE_DEFAULT,
  useFallback = false,
) => {
  if (typeof translatable === 'string') return translatable

  if (!locale)
    throw new Error('No locale given for translatable that is not a string.')

  let result = translatable[locale]

  // When missing translation and fallback is allowed, use default locale.
  if (!result && useFallback) {
    result = translatable[LOCALE_DEFAULT]
  }

  if (!result)
    throw new Error(`Could not get translation for locale ${locale}.`)

  return result
}

export const useResolveTranslatable = (locale = LOCALE_DEFAULT) => {
  return (translatable: Translatable) =>
    resolveTranslatable(translatable, locale)
}
