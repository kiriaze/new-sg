'use strict';

var config = require('../config'),
	gulp   = require('gulp'),
	clean  = require('gulp-clean'),
	del    = require('del');

gulp.task('clean', function() {
	del([config.destPaths.root]);
});
