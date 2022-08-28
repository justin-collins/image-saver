const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
	target: "electron-renderer",
	plugins: [
		new NodePolyfillPlugin({
			excludeAliases: ['process']
		})
	],
	resolve: {
		fallback: {
			"process": false,
			"fs": false,
			"child_process": false,
			"mock-aws-s3": false,
			"aws-sdk": false,
			"nock": false,
			"net": false,
			"tls": false,
			"dns": false,
		}
	},
	externals: {
		sqlite3: "commonjs sqlite3",
		"@journeyapps/sqlcipher": "commonjs @journeyapps/sqlcipher"
	}
}
