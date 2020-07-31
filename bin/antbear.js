#!/usr/bin/env node
/* eslint-disable no-console */

const path = require('path');
const minimist = require('minimist');
const glob = require('glob');
const kleur = require('kleur');
const longest = require('longest');
const { flatMap, sortBy } = require('lodash');
const {
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
} = require('../src');

function getBinaryName() {
	const binaryPath = process.env._;
	return binaryPath && binaryPath.endsWith('/npx') ? 'npx antbear' : 'antbear';
}

function commandHelp() {
	console.log(
		[
			kleur.underline('Usage'),
			[
				'   ',
				kleur.bold(getBinaryName()),
				kleur.yellow('[OPTIONS]'),
				kleur.cyan('<PATTERN>'),
			].join(' '),
			kleur.underline('Options'),
			['   ', kleur.yellow('--verbose'), 'Print additional information'].join(
				' '
			),
		].join('\n\n')
	);
}

function printInstances(instances) {
	instances.forEach(({ filename, component, styles }) => {
		console.log(kleur.bold(component), path.basename(filename));
		styles.forEach((style) => {
			console.log('   ', kleur.cyan(style.name), kleur.magenta(style.value));
		});
		console.log();
	});
}

function printMetric(value, caption) {
	console.log(kleur.underline(caption), value.toFixed(2));
	console.log();
}

function printObject(object, caption) {
	const keyColWidth = longest(Object.keys(object)).length;
	const valueColWidth = longest(Object.values(object)).length;
	const rows = sortBy(Object.entries(object), ([, value]) => value).reverse();

	console.log(kleur.underline(caption));
	console.log();

	rows.forEach(([key, value]) => {
		console.log(
			kleur.cyan(key.padEnd(keyColWidth)),
			' ',
			String(value).padStart(valueColWidth)
		);
	});

	console.log();
}

const argv = minimist(process.argv.slice(2));
const patterns = argv._;
const isVerbose = argv.verbose;

if (patterns.length > 0) {
	const files = flatMap(patterns, (pattern) => glob.sync(pattern));
	const instances = getInstances(files);

	printMetric(
		getStylesPerModule(instances, files.length),
		'Custom styles per module'
	);
	printObject(getElementsStats(instances), 'Overridden elements');
	printObject(getComponentsStats(instances), 'Overridden components');
	printObject(getPropsStats(instances), 'Properties');
	printObject(getValuesStats(instances), 'Values');
	printObject(getColorsStats(instances), 'Custom colors');
	printObject(getSpacingStats(instances), 'Custom spacing');
	printObject(getComponentsPropsStats(instances), 'Components and props');
	printObject(
		getComponentsPropsValuesStats(instances),
		'Components, props and values'
	);

	if (isVerbose) {
		printInstances(instances);
	}
} else {
	commandHelp();
}
