'use strict';

var config 		   = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	glob           = require('glob'),
	path           = require('path'),
	fs             = require('fs'),
	plugins        = require('gulp-load-plugins')();


// Hack the ability to import directories in Sass into newly created modules.scss file automatically
gulp.task('sass-includes', function () {

	var modStyle = 'style.scss';

	glob(config.srcPaths.root + '/modules/**/' + modStyle, function (error, files) {

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

});

// Hack the ability to require scripts into newly created modules.js file automatically
gulp.task('js-includes', function () {

	var modStyle = 'script.js';

	glob(config.srcPaths.root + '/modules/**/' + modStyle, function (error, files) {

		var content = [],
			finalContent;

		files.forEach(function (allModStyles) {

			var directory = path.dirname(allModStyles);

			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					path.basename(file) === modStyle
				)
			});

			content.push('require("../../' + directory.replace('src/','') + '/' + partials + '");');

		});

		finalContent = content.join('\n');

		fs.writeFile(config.srcPaths.scripts + '/modules.js', finalContent);

	});

});
