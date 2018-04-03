/* eslint-disable */

const path = require('path');
const wallabyWebpack = require('wallaby-webpack');

module.exports = function (wallaby) {

	var webpackPostprocessor = wallabyWebpack({
		resolve: {
			modules: [
				path.join(__dirname, './src'),
				'node_modules'
			]
		}
	});

	return {
		files: [
			{ pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false },
			{ pattern: 'src/**/*.js', load: false, instrument: true }
		],
		tests: [
			{ pattern: 'test/**/*.tests.js', load: false }
		],
		compilers: {
			'**/*.js': wallaby.compilers.babel()
		},
		env: {
			kind: "chrome"
		},
		postprocessor: webpackPostprocessor,
		setup: function () {
			window.__moduleBundler.loadTests();
		},
	};

};
