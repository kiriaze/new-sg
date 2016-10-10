'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	browserSync    = require('browser-sync');

gulp.task('html-helpers', function() {
	return gulp.src(config.srcPaths.htmlHelpers)
		.pipe(gulp.dest(config.destPaths.htmlHelpers))
		.pipe(browserSync.reload({stream:true}))
});
