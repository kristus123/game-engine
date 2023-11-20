module.exports = {
	plugins: [
		'@stylistic/js',
	],
	'env': {
		'browser': true,
		'es2021': true,
	},
	'extends': 'eslint:recommended',
	'overrides': [
		{
			'env': {
				'node': true,
			},
			'files': [
				'.eslintrc.{js,cjs}',
			],
			'parserOptions': {
				'sourceType': 'script',
			},
		},
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
	},
	'rules': {
		'@stylistic/js/comma-dangle': 
			[
				'error', 
				'only-multiline',
			],
		'@stylistic/js/brace-style': [
			'error',
			'stroustrup',
		],
		'@stylistic/js/indent': [
			'error',
			'tab',
		],
		'@stylistic/js/linebreak-style': [
			'error',
			'unix',
		],
		'@stylistic/js/quotes': [
			'error',
			'single',
		],
		'@stylistic/js/semi': [
			'error',
			'never',
		],
	},
}
