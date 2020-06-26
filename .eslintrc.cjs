module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'consistent-return': 0,
  },
};
