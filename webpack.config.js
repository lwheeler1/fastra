/*
 * webpack.config.js
 * version 1.0.0
 */

var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/src/build/js');
var APP_DIR = path.resolve(__dirname, 'public/src/app/js');

var config = {
	entry: APP_DIR + '/app.js',
	output: {
		path: BUILD_DIR,
		filename: 'build.min.js'
	},
	module : {
		rules: [
			{
				test: /\.js$/,
				include: APP_DIR,
				use: [ 'babel-loader'],
				exclude: /node_modules/,
			}
		],
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	},
	resolve: {
		extensions: [".js"]
	},
	stats: {
        colors: true
    },
    devtool: 'source-map'
};

module.exports = config;