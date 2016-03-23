'use strict';

var gulp        = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('default', function() {
	runSequence(
		'clean',
		'bower',
		'mbf',
		'modules',
		'styleguide',
		'pages',
		'sass',
		'sass-includes',
		'styleguide-js',
		'modules-js',
		'js-includes',
		'images',
		'fonts',
		'json',
		'cname',
		'build-date',
		'browserSync',
		'watch'
	)
});
