module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'array-element-newline': ['error', 'consistent'],
    'prettier/prettier': ['off', { endofline: 'auto' }],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
