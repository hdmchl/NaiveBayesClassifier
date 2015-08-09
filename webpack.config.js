var path = require('path');

module.exports = {
	entry: [
		'./src/index.js'
	],
	output: {
		filename: 'NaiveBayesClassifier.js',
		path: path.join(__dirname, 'dist'),
		library: 'NaiveBayesClassifier',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{ test: /\.js$/, loaders: ['babel'] }
		]
	}
};