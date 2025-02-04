// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const folders = fs
	.readdirSync('src', { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => !['styles'].includes(dirent.name) && dirent.name);

module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'plugin:react/recommended',
		'airbnb',
		'airbnb-typescript',
		'prettier',
		'airbnb-typescript-prettier'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: 'module',
		extraFileExtensions: ['.css'],
		project: './tsconfig.json'
	},
	plugins: [
		'react',
		'@typescript-eslint',
		'simple-import-sort',
		'import',
		'unused-imports',
		'prettier'
	],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': [
			1,
			{
				extensions: ['.ts', '.tsx']
			}
		],
		'react/jsx-props-no-spreading': 'off',
		'no-underscore-dangle': 'off',
		'no-param-reassign': 'off',
		'react/function-component-definition': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'import/prefer-default-export': 'off',
		'import/no-cycle': 'off',
		'no-plusplus': 'off',
		'no-useless-escape': 'off',
		'no-restricted-exports': 'off',
		'jsx-a11y/anchor-is-valid': [
			'error',
			{
				components: ['Link'],
				specialLink: ['hrefLeft', 'hrefRight'],
				aspects: ['invalidHref', 'preferButton']
			}
		],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-duplicates': 'error',
		'unused-imports/no-unused-imports': 'error',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'variableLike',
				format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
				leadingUnderscore: 'allow'
			}
		],
		'prettier/prettier': ['error', { usePrettierrc: true }]
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				moduleDirectory: ['node_modules', 'src/']
			}
		}
	},
	overrides: [
		{
			files: ['**/*.ts?(x)'],
			rules: {
				'simple-import-sort/imports': [
					'error',
					{
						groups: [
							// Packages. `react` related packages come first.
							// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
							['^react', '^next', '^recoil', '^@?\\w'], // Absolute imports and Relative imports.
							['^styles'],
							[`^(${folders.join('|')})(/.*|$)`, '^\\.'], // for scss imports.
							['^[^.]']
						]
					}
				]
			}
		}
	]
};
