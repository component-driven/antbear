const { countBy, flatMap } = require('lodash');

// TODO: Custom colors
// TODO: Custom spacing

const isComponent = (name) => name.match(/^[A-Z]/);

const getAllStyles = (instances) =>
	flatMap(instances, (instance) => instance.styles);

module.exports.getElementsStats = function (instances) {
	const elementsOnly = instances.filter(
		(instance) => !isComponent(instance.component)
	);
	return countBy(elementsOnly, (instance) => instance.component);
};

module.exports.getComponentsStats = function (instances) {
	const componentsOnly = instances.filter((instance) =>
		isComponent(instance.component)
	);
	return countBy(componentsOnly, (instance) => instance.component);
};

module.exports.getPropsStats = function (instances) {
	const styles = getAllStyles(instances);
	return countBy(styles, (style) => style.name);
};

module.exports.getValuesStats = function (instances) {
	const styles = getAllStyles(instances);
	return countBy(styles, (style) => style.value);
};
