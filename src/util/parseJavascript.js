const { kebabCase, flatMap } = require('lodash');
const { walk } = require('estree-walker');
const { compile, serialize, middleware } = require('stylis');
const cssShorthandExpand = require('css-shorthand-expand');
const { compileCode } = require('./compileCode');

const EXPRESSION_PLACEHOLDER = '$EXPRESSION$';

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
	// { margin: 0 }
	if (node.type === 'StringLiteral' || node.type === 'NumericLiteral') {
		return node.value;
	}

	// { width: SIZE }
	if (node.type === 'Identifier') {
		return normalizeExpression(node.name);
	}

	if (node.type === 'ArrowFunctionExpression') {
		// { color: props => props.theme.colors.primary }
		return normalizeExpression(
			getThemeToken(
				node.body,
				code,
				node.params.length === 1 ? node.params[0].name : ''
			)
		);
	}

	// { color: props.theme.colors.primary }
	if (node.type === 'MemberExpression') {
		return normalizeExpression(getThemeToken(node, code, propsObjectName));
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
	return flatMap(node.properties, (prop) =>
		normalizeCssProp(
			getPropertyKey(prop),
			getValue(prop.value, code, propsObjectName)
		)
	);
}

function getStylesFromCss(css) {
	const styles = [];
	serialize(
		compile(css),
		middleware([
			(element) => {
				if (element.type === 'decl') {
					styles.push(...normalizeCssProp(element.props, element.children));
				}
			},
		])
	);
	return styles;
}

function normalizeCssProp(rawProp, rawValue) {
	const expanded = expandCssProp(kebabCase(rawProp), String(rawValue));
	return Object.entries(expanded).map(([name, value]) => ({ name, value }));
}

function expandCssProp(rawProp, rawValue) {
	// Do not expand these props
	if (
		[
			'border',
			'border-width',
			'border-style',
			'border-color',
			'border-top',
			'border-right',
			'border-bottom',
			'border-left',
			'border-radius',
			'outline',
		].includes(rawProp)
	) {
		return {
			[rawProp]: rawValue,
		};
	}

	try {
		return (
			cssShorthandExpand(rawProp, rawValue) || {
				[rawProp]: rawValue,
			}
		);
	} catch (err) {
		console.warn(`Can’t expand CSS property {${rawProp}: ${rawValue}}:\n`, err);
		return undefined;
	}
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

// Don’t keep complex expression because they break Stylis,
// and not very useful to analyze anyway
function normalizeExpression(value) {
	return value.match(/[:`]/) ? EXPRESSION_PLACEHOLDER : `(${value})`;
}

/**
 * Finds all styled components in a JavaScript files, and returns their
 * styles and component names
 * @param {string} code
 * @param {string} filename
 * @return {object}
 */
module.exports.parseJavaScript = function (source, filename) {
	const { ast } = compileCode(source, filename);

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
					const styles = getStyles(node, source);
					instances.push({ filename, component, styles });
				}
			}
		},
	});

	return instances;
};
