// Allow angular using electron module (native node modules)
const fs = require('fs');
const f_angular = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

fs.readFile(f_angular, 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	var result = data.replace(/target: "electron-renderer",/g, '');
	var result = result.replace(/target: "web",/g, '');
	var result = result.replace(/externals: {sqlite3: "commonjs sqlite3"},/g, '');
	var result = result.replace(/return \{/g, 'return {target: "electron-renderer", externals: {sqlite3: "commonjs sqlite3"},');

	fs.writeFile(f_angular, result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});
