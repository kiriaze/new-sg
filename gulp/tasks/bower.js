'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	$              = require('gulp-load-plugins')(),
	mainBowerFiles = require('main-bower-files');


// Init/install Bower
gulp.task('bower', function() {
	return $.bower(config.bowerDir)
		.pipe(gulp.dest(config.bowerDir))
});

// parted out mainbowerfiles into its own function
gulp.task('mbf', function () {
	// exclude jquery from vendor.js build to prevent conflicts
	// when referencing it within wp or other cms builds
	gulp.src(mainBowerFiles({includeDev: true}))
		.pipe($.filter(['**/*.js', '!jquery.js']))
		.pipe($.uglify().on('error', function(e){
			console.log(e);
		}))
		.pipe($.concat('vendor.js'))
		.pipe(gulp.dest('dist/assets/js/'));

	// run the vendor build again but this time
	// include jquery into bundled.js for reference
	// within styleguide
	gulp.src(mainBowerFiles({includeDev: true}))
		.pipe($.filter(['**/*.js']))
		.pipe($.uglify().on('error', function(e){
			console.log(e);
		}))
		.pipe($.concat('bundle.js'))
		.pipe(gulp.dest('dist/assets/js/'));

	// testing custom plugins
	gulp.src([config.srcPaths.scripts + '/plugins/**/*.js', '!prism.js'])
		.pipe($.uglify().on('error', function(e){
			console.log(e);
		}))
		.pipe($.concat('plugins.js'))
		.pipe(gulp.dest('dist/assets/js/'));

	// concat all bower css into vendor.css
	gulp.src(mainBowerFiles({includeDev: true}))
		.pipe($.filter('**/*.css'))
		.pipe($.concat('vendor.css'))
		.pipe(gulp.dest('dist/assets/css/'));
});
