import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'vue/no-undef-components': ['error'],
    'node/prefer-global/process': 'off',
    'test/consistent-test-it': ['off'],
  },

  yaml: false,
  ignores: [
    'tsconfig.*',
  ],
})
