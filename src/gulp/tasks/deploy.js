var config  = require('../config'),
	gulp 	= require('gulp'),
	rsync	= require('gulp-rsync');

gulp.task('deploy', ['prod'], function() {

	return gulp.src([config.destPaths.root + '/**/*'])
		.pipe(rsync({
			root: config.destPaths.root,
			hostname: config.hostname,
			username: config.username,
			password: config.password,
			destination: config.destination,
			incremental: true,
			exclude: config.exclude
		}));

});
