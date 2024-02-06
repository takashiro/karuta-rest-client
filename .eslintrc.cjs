module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
		project: './tsconfig.test.json',
  },
  rules: {
		'consistent-return': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
    indent: 'off',
    'linebreak-style': 'off',
		'no-continue': 'off',
		'no-plusplus': 'off',
		'no-param-reassign': 'off',
		'no-restricted-syntax': [
			'error',
			'WithStatement',
		],
		'no-shadow': 'off',
    'no-tabs': 'off',
		'no-unused-vars': 'off',
  },
};
