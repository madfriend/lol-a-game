const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				options: {
					presets: ['env']
				}
			}
		]
	},

	plugins: [new UglifyJSPlugin()],
	entry: {
		main: './src/index.js'
	},

	output: {
		filename: 'bundle.min.js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	mode: 'development'
};
