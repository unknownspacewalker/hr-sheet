module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
  },
  settings: {
    'import/extensions': [".js", ".ts"],
    'import/parsers': {
      '@typescript-eslint/parser': [".ts"]
    },
    'import/resolver': {
      'node': {
        'paths': ['.'],
        'extensions': [".js", ".ts"]
      },
    }
  },
};
