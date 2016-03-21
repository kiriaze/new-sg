'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	plugins		   = require('gulp-load-plugins')(),
	browserSync    = require('browser-sync'),
	mainBowerFiles = require('main-bower-files');

// Compile, concat, minify, autoprefix and sourcemap SCSS + bower
gulp.task('sass', function() {

	var files = [config.srcPaths.styles + '/styleguide.scss', config.srcPaths.styles + '/modules.scss'];

	return gulp.src(files)
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass({
				outputStyle: 'compressed' //  nested, expanded, compact, compressed
			}).on('error', plugins.sass.logError))
			.pipe(plugins.autoprefixer('last 2 versions'))
			.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(config.destPaths.styles))
		.pipe(plugins.filter('**/*.css')) // filters out css so browsersync css injection can work with sourcemaps
		.pipe(browserSync.reload({stream: true}));
});
