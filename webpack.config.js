const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

	entry: [
		'babel-polyfill',
		'./src/index.js',
	],

	resolve: {
		modules: [
			path.join(__dirname, './src'),
			'node_modules',
		],
	},

	devtool: 'cheap-module-source-map',

	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'dist'),
	},

	module: {
		rules: [
			{
				test: /\.less$/,
				exclude: /node_modules/,
				enforce: 'pre',
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015', 'stage-0', 'react'],
						},
					},
				],
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({ template: './src/index.html' }),
	],

};
