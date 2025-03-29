import commitlintConfigConventional from '@commitlint/config-conventional'

const ruleMaxLineLength =
  commitlintConfigConventional.rules['body-max-line-length']

ruleMaxLineLength[0] = process.env.CI === 'true' ? 1 : 2

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': ruleMaxLineLength,
    'footer-max-line-length': ruleMaxLineLength,
  },
}
