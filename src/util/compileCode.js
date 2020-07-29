const babel = require('@babel/core');

const BABEL_OPTIONS = {
	presets: ['@babel/typescript', '@babel/flow', '@babel/react'],
	babelrc: false,
	configFile: false,
};

module.exports.compileCode = function (code, filename) {
	return babel.transformSync(code, { filename, ...BABEL_OPTIONS }).code;
};
