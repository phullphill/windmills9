const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {

	entry: [
		'./src/index.js',
	],

	resolve: {
		modules: [
			path.join(__dirname, './src'),
			'node_modules',
		],
	},

	devtool: 'source-map',

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
					'babel-loader'
				],
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({ template: './src/index.html' }),
		new WebpackNotifierPlugin(),
		new CircularDependencyPlugin({
			exclude: /node_modules/,
			failOnError: true,
			cwd: process.cwd(),
		})
	],

};
