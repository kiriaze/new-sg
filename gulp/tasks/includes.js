'use strict';

var config 		   = require('../config'),
	gulp           = require('gulp'),
	glob           = require('glob'),
	path           = require('path'),
	fs             = require('fs');

// Hack the ability to import directories in Sass into newly created modules.scss file automatically
gulp.task('sass-includes', function () {

	var modStyle = 'style.scss';

	// modules

	// default
	glob(config.srcPaths.root + '/modules/**/' + modStyle, {
		"ignore": [
			config.srcPaths.root + '/modules/**/mobile/' + modStyle
		]
	}, function (error, files) {

		// console.log(files);

		var content = [],
			finalContent;

		files.forEach(function (allModStyles) {

			var directory = path.dirname(allModStyles);

			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					path.basename(file) === modStyle
				)
			});

			content.push('@import "' + directory + '/' + partials + '";');

		});

		finalContent = content.join('\n');

		fs.writeFile(config.srcPaths.styles + '/modules.scss', finalContent);

	});

	// mobile
	glob(config.srcPaths.root + '/modules/**/mobile/' + modStyle, function (error, files) {

		// console.log(files);

		var content = [],
			finalContent;

		files.forEach(function (allModStyles) {

			var directory = path.dirname(allModStyles);

			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					path.basename(file) === modStyle
				)
			});

			content.push('@import "' + directory + '/' + partials + '";');

		});

		finalContent = content.join('\n');

		fs.writeFile(config.srcPaths.styles + '/m-modules.scss', finalContent);

	});

});

// Hack the ability to require scripts into newly created modules.js file automatically
gulp.task('js-includes', function () {

	var modScript = 'script.js';

	// Mods

	// default
	glob(config.srcPaths.root + '/modules/**/' + modScript, {
		"ignore": [
			config.srcPaths.root + '/modules/**/mobile/' + modScript
		]
	}, function (error, files) {

		// console.log(files);

		var content = [],
			finalContent;

		files.forEach(function (allModScripts) {

			var directory = path.dirname(allModScripts);

			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					path.basename(file) === modScript
				)
			});

			content.push('require("../../' + directory.replace('src/','') + '/' + partials + '");');

		});

		finalContent = content.join('\n');

		fs.writeFile(config.srcPaths.scripts + '/modules.js', finalContent);

	});

	// mobile
	glob(config.srcPaths.root + '/modules/**/mobile/' + modScript, function (error, files) {

		// console.log(files);

		var content = [],
			finalContent;

		files.forEach(function (allModScripts) {

			var directory = path.dirname(allModScripts);

			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					path.basename(file) === modScript
				)
			});

			content.push('require("../../' + directory.replace('src/','') + '/' + partials + '");');

		});

		finalContent = content.join('\n');

		fs.writeFile(config.srcPaths.scripts + '/m-modules.js', finalContent);

	});

});
