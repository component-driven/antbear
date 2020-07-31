const fs = require('fs');
const { flatMap } = require('lodash');
const { parseJavaScript } = require('./util/parseJavaScript');
const {
	getStylesPerModule,
	getElementsStats,
	getComponentsStats,
	getPropsStats,
	getValuesStats,
	getColorsStats,
	getSpacingStats,
	getComponentsPropsStats,
	getComponentsPropsValuesStats,
} = require('./stats');

function getInstances(files) {
	return flatMap(files, (filename) => {
		const code = fs.readFileSync(filename, 'utf8');
		return parseJavaScript(code, filename);
	});
}

module.exports = {
	getStylesPerModule,
	getInstances,
	getElementsStats,
	getComponentsStats,
	getPropsStats,
	getValuesStats,
	getColorsStats,
	getSpacingStats,
	getComponentsPropsStats,
	getComponentsPropsValuesStats,
};
