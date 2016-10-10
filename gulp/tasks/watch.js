'use strict';

var config        = require('../config'),
	gulp          = require('gulp'),
	browserSync   = require('browser-sync'),
	path          = require('path'),
	runSequence   = require('run-sequence'),
	reload        = browserSync.reload;

// Watchers
gulp.task('watch', function() {

	// scss
	browserSync.watch([config.srcPaths.root + '/**/*.scss'], function (event, file) {
		if ( event === 'change' ) {
			runSequence('sass')
		}
	});

	// customizer
	browserSync.watch(config.srcPaths.root + '/assets/scss/customizer.scss', function (event, file) {
		if ( event === 'change' ) {
			runSequence('customizer-css')
		}
	});

	/////////////////////////////////////

	// js
	browserSync.watch(config.srcPaths.root + '/**/*.js', function (event, file) {
		if ( event === 'change' ) {
			// no longer running styleguide-js,
			// issues with having to reload the page twice to see effects
			// run gulp styleguide-js when you change styleguide.js/iframe.js?
			runSequence('modules-js')
		}
	});

	// required to avoide double reloading page by tying to runSquence above
	gulp.watch([config.destPaths.root + '/assets/js/*.js']).on("change", function(file) {
		reload(file.path);
		// console.log(file,file.path);
	});


	// customizer
	browserSync.watch(config.srcPaths.root + '/assets/js/customizer.js', function (event, file) {
		if ( event === 'change' ) {
			runSequence('customizer-js')
		}
	});

	/////////////////////////////////////

	// images
	browserSync.watch(config.srcPaths.root + '/assets/images/**/*', function (event, file) {
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('images', reload)
		}
	});

	/////////////////////////////////////

	// only modules
	browserSync.watch([
		config.srcPaths.root + '/modules/**/*.hbs',
		config.srcPaths.root + '/modules/**/*.json',
		// config.srcPaths.root + '/partials/*.hbs',
		// ignore files that get written to prevent infinite loops
		// '!src/partials/page-nav.hbs'
	], function(event, file){
		if ( event === 'change' ) {
			// console.log('watch mods task');
			// required to run hbs after for update of modules.html
			runSequence('modules', 'styleguide', 'pages', reload)
		}
	});

	/////////////////////////////////////

	// styleguide structure
	browserSync.watch([
		config.srcPaths.root + '/*.html',
		'_data.json'
	], function(event, file){
		if ( event === 'change' ) {
			// console.log('watch sg task');
			runSequence('styleguide', reload)
		}
	});

	/////////////////////////////////////

	// pages
	browserSync.watch([
		config.srcPaths.root + '/pages/**/*.html',
		config.srcPaths.data.pages
	], function(event, file){
		if ( event === 'change' ) {
			// console.log('watch page task');
			runSequence('pages', reload)
		}
	});

});
