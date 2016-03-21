'use strict';

var config      = require('../config'),
	gulp        = require('gulp'),
	size		= require('gulp-size');

// output size in console
gulp.task('info', function() {
	// You can pass as many relative urls as you want
	return gulp.src(config.destPaths.root + '/*/**')
		.pipe(size())
});
