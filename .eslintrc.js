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
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				ts: 'never',
				js: 'never',
			},
		],
    indent: 'off',
    'linebreak-style': 'off',
		'no-continue': 'off',
		'no-plusplus': 'off',
		'no-restricted-syntax': [
			'error',
			'WithStatement',
		],
    'no-tabs': 'off',
		'no-unused-vars': 'off',
  },
	settings: {
		'import/resolver': {
			node: {
				extensions: [
					'.ts',
					'.js',
				],
			},
		},
	},
};
