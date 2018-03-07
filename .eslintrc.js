var path = require('path');

module.exports = {
	extends: [
		'airbnb',
		'plugin:import/errors',
		'plugin:import/warnings',
	],
	settings: {
		'import/resolver': 'webpack',
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			generators: true,
			experimentalObjectRestSpread: true
		}
	},
	env: {
		browser: true,
		node: true,
		es6: true,
		jasmine: true,
	},
	plugins: [
		'import',
		'react'
	],
	rules: {
		'arrow-body-style': ['error', 'as-needed'], // must have braces around arrow function body, except if only returning an expression
		'arrow-parens': ['error', 'always'], // must have parens around arrow function args
		'class-methods-use-this': ['off'], // class methods are not required to use `this`
		'comma-dangle': ['error', 'always-multiline'], // must have trailing commas when last element is in a different line than the closing ] or }
		'default-case': 'error',  // must have default case in switch statements
		'generator-star-spacing': ['error', { 'before': false, 'after': true }],  // must be no space before generator star, and one space after
		'import/no-unresolved': ['warn', { caseSensitive: false }], // ignore unresolved imports - they're picked up by webpack build process anyway
		'import/prefer-default-export': 'off', // allow single export to be named, rather than default
		'indent': ['error', 'tab', { 'SwitchCase': 1 }], // must indent with 4 spaces, even switch case statements
		'jsx-a11y/no-static-element-interactions': 'off', // allow static elements, such as divs, to have interactive handlers
		'linebreak-style': ['off', 'windows'],  // should use windows linebreak style
		'max-len': ['off'], // allow lines to be any length
		'new-cap': 'warn',  // constructor shouldn't start with capital
		'no-cond-assign': ['error', 'except-parens'], // must not use assignment op in conditions
		'no-confusing-arrow': ['off'], // allow fat arrow func which returns ternary expression
		'no-constant-condition': ['error', { 'checkLoops': false }],  // must not use constants in conditions, except loops
		'no-continue': ['off'], // allow continue statements in loops - but beware unnecessary usage
		'no-else-return': 'off', // allow if return else return
		'no-param-reassign': ['off'], // allow reassign to function arg
		'no-plusplus': ['off'], // allow use of ++ operator
		'no-restricted-syntax': ['off'], // allow use of `for of` statements, `for in` statements, etc
		'no-tabs': ['off'], // allow use of tabs
		'no-underscore-dangle': 'off', // allow underscore prefix on variable name
		'no-unused-vars': ['warn', { 'vars': 'local', 'args': 'none' }], // should not have unused args
		"object-curly-newline": ['off'], // allow an object to be multiline and there's no newline after the opening brace
		'padded-blocks': 'off', // allow blocks to be unpadded with blank lines
		'quotes': ['error', 'single'],  // strings must be quoted with single quotes
		'quote-props': ['error', 'consistent-as-needed'], // if any property name needs quotes around it they must all do
		'react/jsx-boolean-value': ['error', 'always'], // must always provide value for boolean props
		'react/jsx-filename-extension': ['error', { 'extensions': ['.js'] }], // allow jsx syntax only in .js files
		'react/jsx-indent': ['error', 'tab'], // must indent jsx by tabs
		'react/jsx-indent-props': ['error', 'tab'], // must indent jsx props by tabs
		'react/no-unused-prop-types': ['error', { 'skipShapeProps': true }], // disallow unused prop types, except for shape props
		'react/sort-comp': ['error', {
			order: [
				'static-methods',
				'lifecycle',
				'everything-else',
				'/^on.+$/',
				'render'
			]
		}], // must order react component functions as given here
		'space-infix-ops': 'off' // allow no spaces around infix ops
	}
};
