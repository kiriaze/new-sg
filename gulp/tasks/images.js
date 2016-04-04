'use strict';

var config       = require('../config'),
	gulp         = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	$            = require('gulp-load-plugins')(),
	browserSync  = require('browser-sync');

// Image tasks
gulp.task('images', function() {
	return gulp.src(config.srcPaths.images)
		.pipe($.changed(config.destPaths.images)) // Ignore unchanged files
		.pipe($.imagemin({
			progressive: true,
			interlaced: true
		})) // Optimize
		.pipe(gulp.dest(config.destPaths.images))
		.pipe(browserSync.reload({stream:true}))
});
