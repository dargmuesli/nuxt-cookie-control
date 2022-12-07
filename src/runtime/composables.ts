export function useCookieControl() {
  const { $cookies } = useNuxtApp()

  return $cookies
}
