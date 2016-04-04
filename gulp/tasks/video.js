'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	browserSync    = require('browser-sync');

gulp.task('video', function() {
	return gulp.src(config.srcPaths.video)
		.pipe(gulp.dest(config.destPaths.video))
		.pipe(browserSync.reload({stream:true}))
});
