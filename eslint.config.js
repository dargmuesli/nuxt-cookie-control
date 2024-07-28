// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default createConfigForNuxt({
  features: {
    tooling: true,
    typescript: true,
  },
  dirs: {
    src: ['./playground'],
  },
}).append(prettierRecommended, {
  rules: { 'prettier/prettier': ['error', { endOfLine: 'auto' }] },
})
