const fs = require('fs');
const { flatMap } = require('lodash');
const { parseJavaScript } = require('./util/parseJavaScript');

module.exports.antbear = function (files) {
	return flatMap(files, (filename) => {
		const code = fs.readFileSync(filename, 'utf8');
		return parseJavaScript(code, filename);
	});
};
