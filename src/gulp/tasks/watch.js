'use strict';

var config        = require('../config'),
	gulp          = require('gulp'),
	browserSync   = require('browser-sync'),
	path          = require('path'),
	reload        = browserSync.reload;

// Watch these files for changes and run the task on update
gulp.task('watch', function() {

	// Watch Sass files
	gulp.watch(config.srcPaths.styles + '/**/*.scss', ['css']);

	// Watch JS files
	gulp.watch(config.srcPaths.scripts, ['js']);

	// Watch image files
	gulp.watch(config.srcPaths.images, ['images'], reload);

	// markup build
	gulp.watch([
		config.srcPaths.root + '/**/*.html',
		config.srcPaths.root + '/**/*.hbs'
	], ['hb-rebuild'], reload);

});
