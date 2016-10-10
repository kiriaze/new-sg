'use strict';

var config      = require('../config'),
	gulp        = require('gulp'),
	browserSync = require('browser-sync');

// Initialize browser-sync which starts a static server across all devices.
// List/kill browserSync server
// lsof -i tcp:3000
// kill -9 PID
gulp.task('browserSync', function() {
	browserSync({
		// Can't have both server and proxy, pick one.
		// proxy: {
		// 	target: 'http://site.dev'
		// }
		server: {
			baseDir: config.destPaths.root
		},
		port: config.serverport,
		notify: false
	});
});
