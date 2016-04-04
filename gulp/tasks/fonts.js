'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	$		       = require('gulp-load-plugins')(),
	mainBowerFiles = require('main-bower-files'),
	browserSync    = require('browser-sync');

gulp.task('fonts', function() {

	var files = mainBowerFiles('**/*.{eot,svg,ttf,woff,woff2}');
	console.log('font bower files: ', files);

	files.push(config.srcPaths.fonts);

	return gulp.src(files)
		.pipe($.changed(config.destPaths.fonts)) // Ignore unchanged files
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(config.destPaths.fonts))
		.pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});
