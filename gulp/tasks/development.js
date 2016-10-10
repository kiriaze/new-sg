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
		'sass-includes',
		'js-includes',
		'pages',
		'sass',
		'modules-js',
		'pages-js',
		'customizer-css',
		'styleguide-js',
		'customizer-js',
		'html-helpers',
		'images',
		'audio',
		'video',
		'fonts',
		'json',
		'cname',
		'build-date',
		'browserSync',
		'watch'
	)
});
