export function useNuxtCookieControl() {
  const { $cookies } = useNuxtApp()

  return $cookies
}
