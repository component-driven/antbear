#!/usr/bin/env node
/* eslint-disable no-console */

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
			['   ', kleur.bold(getBinaryName()), kleur.yellow('<PATTERN>')].join(' '),
		].join('\n\n')
	);
}

const argv = minimist(process.argv.slice(2));
const patterns = argv._;

if (patterns.length > 0) {
	const files = flatMap(patterns, (pattern) => glob.sync(pattern));
	const instances = antbear(files);

	instances.forEach(({ component, styles }) => {
		console.log(kleur.bold(component));
		styles.forEach((style) => {
			console.log('   ', kleur.cyan(style.name), kleur.magenta(style.value));
		});
	});
} else {
	commandHelp();
}
