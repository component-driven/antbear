const fs = require('fs');
const { flatMap } = require('lodash');
const { parseJavaScript } = require('./util/parseJavaScript');
const {
	getElementsStats,
	getComponentsStats,
	getPropsStats,
	getValuesStats,
	getColorsStats,
	getSpacingStats,
} = require('./stats');

function getInstances(files) {
	return flatMap(files, (filename) => {
		const code = fs.readFileSync(filename, 'utf8');
		return parseJavaScript(code, filename);
	});
}

module.exports = {
	getInstances,
	getElementsStats,
	getComponentsStats,
	getPropsStats,
	getValuesStats,
	getColorsStats,
	getSpacingStats,
};
