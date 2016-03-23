'use strict';

var config        = require('../config'),
	gulp          = require('gulp'),
	browserSync   = require('browser-sync'),
	path          = require('path'),
	runSequence   = require('run-sequence'),
	reload        = browserSync.reload;


// Watchers
gulp.task('watch', function() {

	// utilizing browsersync.watch > gulp.watch

	// scss
	browserSync.watch(config.srcPaths.root + '/**/*.scss', function (event, file) {
		if ( event === 'change' ) {
			runSequence('sass')
			browserSync.reload('*.css'); // for injection only
		}
	});

	// js
	browserSync.watch(config.srcPaths.root + '/**/*.js', function (event, file) {
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('modules-js', 'styleguide-js', browserSync.reload)
		}
	});

	// images
	browserSync.watch(config.srcPaths.root + '/assets/images/**/*', function (event, file) {
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('images', browserSync.reload)
		}
	});

	// only modules
	browserSync.watch([
		config.srcPaths.root + '/partials/*.hbs',
		config.srcPaths.root + '/modules/**/*.hbs',
		config.srcPaths.root + '/modules/**/*.json'
	], function(event, file){
		if ( event === 'change' ) {
			console.log('watch mods');
			// required to run hbs after for update of modules.html
			runSequence('modules', 'styleguide', browserSync.reload)
		}
	});

	// styleguide structure
	browserSync.watch([
		config.srcPaths.root + '/*.html',
		'_data.json'
	], function(event, file){
		if ( event === 'change' ) {
			runSequence('styleguide', browserSync.reload)
		}
	});

	// pages
	browserSync.watch([
		config.srcPaths.root + '/pages/**/*.html',
		'_data.json'
	], function(event, file){
		if ( event === 'change' ) {
			runSequence('pages', browserSync.reload)
		}
	});

});
