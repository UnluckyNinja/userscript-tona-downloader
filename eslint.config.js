import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'vue/no-undef-components': ['error'],
    'node/prefer-global/process': 'off',
    'test/consistent-test-it': ['off'],
    'style/brace-style': ['off'],
    'antfu/if-newline': ['off'],
    'style/quotes': ['warn', 'single'],
  },

  yaml: false,
  ignores: [
    'tsconfig.*',
  ],
})
