const { Parser } = require('acorn');

const ACORN_OPTIONS = {
	ecmaVersion: 2019,
	sourceType: 'module',
};

module.exports.getAst = function (code) {
	try {
		return Parser.parse(code, ACORN_OPTIONS);
	} catch (err) {
		console.warn(`Acorn cannot parse code: ${err.message}\n\nCode:\n${code}`);
		return undefined;
	}
};
