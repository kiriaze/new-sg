'use strict';

var config 		  = require('../config'),
	gulp          = require('gulp'),
	cp            = require('child_process'),
	browserSync   = require('browser-sync'),
	plugins	      = require('gulp-load-plugins')();

gulp.task('markup', function() {

	// exclude vendor plugin html files from output
	return gulp.src([config.srcPaths.html, '!src/assets/vendor/**/*.html'])
		.pipe(plugins.hb({
			partials: config.srcPaths.partials,
			helpers: config.srcPaths.helpers,
			data: config.srcPaths.data
		}))
		.pipe(gulp.dest(config.destPaths.root));
});

gulp.task('hb-rebuild', ['markup'], function() {
	browserSync.reload();
});

gulp.task('html', function() {
    return gulp.src(config.destPaths.root + '/**/*.html')
        .pipe(plugins.htmlmin({
        	collapseWhitespace: true,
            removeComments: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest(config.destPaths.root))
});
