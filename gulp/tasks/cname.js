'use strict';

var config = require('../config'),
	gulp   = require('gulp');

// CNAME
gulp.task('cname',function(){
	return gulp.src('CNAME')
		.pipe(gulp.dest(config.destPaths.root))
});
