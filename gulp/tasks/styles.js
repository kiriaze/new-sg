'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	$	     	   = require('gulp-load-plugins')(),
	browserSync    = require('browser-sync'),
	mainBowerFiles = require('main-bower-files');

// Compile, concat, minify, autoprefix and sourcemap SCSS + bower
gulp.task('sass', function() {

	var files = [
		config.srcPaths.styles + '/styleguide.scss',
		config.srcPaths.styles + '/modules.scss'
	];

	return gulp.src(files)
		.pipe($.sourcemaps.init())
			// the `changed` task needs to know the destination directory
			// upfront to be able to figure out which files changed
			.pipe($.changed(config.destPaths.styles)) // Ignore unchanged files
			.pipe($.sass({
				outputStyle: 'expanded' //  nested, expanded, compact, compressed
			}).on('error', $.sass.logError))
			.pipe($.autoprefixer('last 2 versions'))
			.pipe($.base64Inline('../images/'))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(config.destPaths.styles))
		// .pipe($.filter('**/*.css')) // filters out css so browsersync css injection can work with sourcemaps
		.pipe(browserSync.stream({match: '**/*.css'}))
});

// customizer
gulp.task('customizer-css', function() {

	var files = [
		config.srcPaths.styles + '/customizer.scss'
	];

	return gulp.src(files)
		.pipe($.sourcemaps.init())
			// the `changed` task needs to know the destination directory
			// upfront to be able to figure out which files changed
			.pipe($.changed(config.destPaths.styles)) // Ignore unchanged files
			.pipe($.sass({
				outputStyle: 'expanded' //  nested, expanded, compact, compressed
			}).on('error', $.sass.logError))
			.pipe($.autoprefixer('last 2 versions'))
			.pipe($.base64Inline('../images/'))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(config.destPaths.styles))
		// .pipe($.filter('**/*.css')) // filters out css so browsersync css injection can work with sourcemaps
		.pipe(browserSync.stream({match: '**/*.css'}))
});
