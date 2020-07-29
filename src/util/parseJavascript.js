const { kebabCase } = require('lodash');
const { walk } = require('estree-walker');
const { compile, serialize, middleware } = require('stylis');
const { compileCode } = require('./compileCode');
const { getAst } = require('./getAst');

function getComponentName(node) {
	// styled.p()
	if (node.type === 'CallExpression') {
		const { property } = node.callee;
		if (property.type === 'Identifier') {
			return property.name;
		}
	}

	// styled.p``
	if (node.type === 'TaggedTemplateExpression') {
		const { property } = node.tag;
		if (property.type === 'Identifier') {
			return property.name;
		}
	}

	console.warn('Can’t find component name for', node);

	return '';
}

function getPropertyKey(node) {
	const { key = {} } = node;

	// Simple object property key
	if (key.type === 'Identifier') {
		return key.name;
	}

	console.warn('Can’t find key for', node);

	return '';
}

function getValue(node, code, propsObjectName) {
	// { color: 'salmon' }
	if (node.type === 'Literal') {
		return node.value;
	}

	// { color: props => props.theme.colors.primary }
	if (node.type === 'ArrowFunctionExpression' && node.params.length === 1) {
		return getThemeToken(node.body, code, node.params[0].name);
	}

	// { color: props.theme.colors.primary }
	if (node.type === 'MemberExpression') {
		return getThemeToken(node, code, propsObjectName);
	}

	console.warn('Can’t find value for', node);

	return '';
}

function getThemeToken(node, code, propsObjectName) {
	return (
		code
			.slice(node.start, node.end)
			// Remove `props.`
			.replace(new RegExp(`^${propsObjectName}\\.`), '')
	);
}

function getStyles(node, code) {
	const styles = [];

	if (node.type === 'CallExpression') {
		node.arguments.forEach((arg) => {
			if (arg.type === 'ObjectExpression') {
				styles.push(...getStylesFromObject(arg, code));
			} else if (arg.type === 'ArrowFunctionExpression') {
				const propsObjectName = arg.params[0].name;
				styles.push(...getStylesFromObject(arg.body, code, propsObjectName));
			}
		});
	} else if (node.type === 'TaggedTemplateExpression') {
		const css = getCssFromQuasi(node, code);
		styles.push(...getStylesFromCss(css));
	}

	return styles;
}

function getStylesFromObject(node, code, propsObjectName) {
	return node.properties.map((prop) => {
		return {
			name: kebabCase(getPropertyKey(prop)),
			value: getValue(prop.value, code, propsObjectName),
		};
	});
}

function getStylesFromCss(css) {
	const styles = [];
	serialize(
		compile(css),
		middleware([
			(element) => {
				if (element.type === 'decl') {
					styles.push({ name: element.props, value: element.children });
				}
			},
		])
	);
	return styles;
}

function getCssFromQuasi({ quasi: { quasis, expressions } }, code) {
	return quasis.reduce((css, quasi, index) => {
		css += quasi.value.raw;
		if (expressions[index]) {
			css += getValue(expressions[index], code);
		}
		return css;
	}, '');
}

/**
 * Finds all styled components in a JavaScript files, and returns their
 * styles and component names
 * @param {string} code
 * @param {string} filename
 * @return {object}
 */
module.exports.parseJavaScript = function (code, filename) {
	const compiledCode = compileCode(code, filename);

	const ast = getAst(compiledCode);
	if (!ast) {
		return [];
	}

	const instances = [];

	walk(ast, {
		enter: (node) => {
			if (
				node.type === 'CallExpression' ||
				node.type === 'TaggedTemplateExpression'
			) {
				const { object = {}, callee = {}, arguments: args = [] } =
					node.tag || node.callee;
				if (
					(object.type === 'Identifier' && object.name === 'styled') ||
					(callee.type === 'Identifier' && callee.name === 'styled')
				) {
					const component = (args[0] && args[0].name) || getComponentName(node);
					const styles = getStyles(node, compiledCode);
					instances.push({ component, styles });
				}
			}
		},
	});

	return instances;
};
