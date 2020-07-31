#!/usr/bin/env node
/* eslint-disable no-console */

const path = require('path');
const minimist = require('minimist');
const glob = require('glob');
const kleur = require('kleur');
const { flatMap } = require('lodash');
const { antbear } = require('../src');

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

const argv = minimist(process.argv.slice(2));
const patterns = argv._;
const isVerbose = argv.verbose;

if (patterns.length > 0) {
	const files = flatMap(patterns, (pattern) => glob.sync(pattern));
	const instances = antbear(files);

	if (isVerbose) {
		printInstances(instances);
	}
} else {
	commandHelp();
}
