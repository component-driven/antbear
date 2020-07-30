const babel = require('@babel/core');

const BABEL_OPTIONS = {
	presets: ['@babel/typescript', '@babel/flow', '@babel/react'],
	plugins: ['@babel/plugin-proposal-class-properties'],
	babelrc: false,
	configFile: false,
	ast: true,
};

module.exports.compileCode = function (code, filename) {
	return babel.transformSync(code, { filename, ...BABEL_OPTIONS });
};
