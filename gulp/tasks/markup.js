'use strict';

var config 		  = require('../config'),
	gulp          = require('gulp'),
	cp            = require('child_process'),
	browserSync   = require('browser-sync'),
	fs            = require('fs'),
	path          = require('path'),
	plugins	      = require('gulp-load-plugins')();


// json/hbs in root of project / styleguide wrapper
gulp.task('styleguide', function() {

	var data = JSON.parse(fs.readFileSync('_data.json'));

	return gulp.src(config.srcPaths.root + '/*.html')
		.pipe(plugins.hb({
			debug: true, // might not go here
			partials: config.srcPaths.partials,
			helpers: config.srcPaths.helpers,
			data: config.srcPaths.data
		})
			.on('error', plugins.notify.onError(function (error) {
				return 'An error occurred while compiling hbs.\nLook in the console for details.\n' + error;
			}))
		)
		.pipe(gulp.dest(config.destPaths.root))
});

// json/hbs styleguide modules
gulp.task('modules', function() {
	return gulp.src(config.srcPaths.root + '/modules/**/html.hbs')
		.pipe(plugins.data(function(file) {
			// console.log(file.path);
			return JSON.parse(fs.readFileSync(path.dirname(file.path) + '/_data.json'));
		}))
		.pipe(plugins.hb({
			partials: config.srcPaths.partials,
			helpers: config.srcPaths.helpers,
			data: config.srcPaths.data
		})
			.on('error', plugins.notify.onError(function (error) {
				return 'An error occurred while compiling hbs.\nLook in the console for details.\n' + error;
			}))
		)
		.pipe(plugins.concat('modules.hbs'))
		.pipe(gulp.dest(config.srcPaths.root + '/partials/layout'))
});

// pages
gulp.task('pages', function() {

	// hb json data
	var data = JSON.parse(fs.readFileSync('_data.json'));

	// Grab all page directories to create sg page nav
	var content = [
			'<li><a href="/styleguide.html">Global</a></li>'
		],
		finalContent,
		// get dir names
		files = fs.readdirSync('src/pages');

	files.forEach(function(file){
		// if not a hidden file
		if ( ! /^\..*/.test(file) ) {
			// console.log(file);
			var pageNav = '<li><a href="'+ file +'">'+ file +' Page</a></li>';
			content.push(pageNav);
		}
	})

	// join them and output file
	finalContent = content.join('\n');
	fs.writeFile(config.srcPaths.root + '/partials/page-nav.hbs', finalContent);

	// hb
	var hbStream = plugins.hb()
		// Partials
		.partials(config.srcPaths.partials)
		.partials(config.srcPaths.modules)
		// like this {{> 04_buttons/html }}, although its empty markup

		// Helpers
		// .helpers(require('handlebars-layouts'))
		.helpers(config.srcPaths.helpers)

		// Data
		.data(config.srcPaths.data)

	return gulp
		.src(config.srcPaths.root + '/pages/**/*.html')
		.pipe(hbStream)
			.on('error', plugins.notify.onError(function (error) {
				return 'An error occurred while compiling hbs.\nLook in the console for details.\n' + error;
			}))
		.pipe(gulp.dest(config.destPaths.root))

});

gulp.task('html', function() {
	return gulp.src(config.destPaths.root + '/**/*.html')
	.pipe(plugins.htmlmin({
		collapseWhitespace: true,
		removeComments: true,
		conservativeCollapse: true,
		collapseBooleanAttributes: true,
		removeRedundantAttributes: true,
		minifyJS: true,
		minifyCSS: true
	}))
	.pipe(gulp.dest(config.destPaths.root))
});
