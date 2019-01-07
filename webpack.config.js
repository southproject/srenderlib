const path = require('path')

module.exports = {
	entry: {
		main: './src/srender.js',
	},
	output: {

		path: path.resolve(__dirname, 'dist'),
		filename: 'srender.js',
		library: 'srender',
		libraryTarget: 'umd',
	}
}