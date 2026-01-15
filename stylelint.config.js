export default {
  extends: 'stylelint-config-standard',
  plugins: ['@stylistic/stylelint-plugin'],
  rules: {
    '@stylistic/indentation': 'tab',
    '@stylistic/string-quotes': 'double',
    'keyframes-name-pattern': null,
    'selector-class-pattern': null,
    'block-no-empty': null,
  },
}
