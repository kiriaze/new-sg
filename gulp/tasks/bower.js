'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	plugins        = require('gulp-load-plugins')(),
	mainBowerFiles = require('main-bower-files');


// Init/install Bower
gulp.task('bower', function() {
	return plugins.bower(config.bowerDir)
		.pipe(gulp.dest(config.bowerDir))
});

// parted out mainbowerfiles into its own function
gulp.task('mbf', function () {
	// exclude jquery from vendor.js build to prevent conflicts
	// when referencing it within wp or other cms builds
	gulp.src(mainBowerFiles({includeDev: true}))
		.pipe(plugins.filter(['**/*.js', '!jquery.js']))
		.pipe(plugins.uglify())
		.pipe(plugins.concat('vendor.js'))
		.pipe(gulp.dest('dist/assets/js/'));

	// run the vendor build again but this time
	// include jquery into bundled.js for reference
	// within styleguide
	gulp.src(mainBowerFiles({includeDev: true}))
		.pipe(plugins.filter(['**/*.js']))
		.pipe(plugins.uglify())
		.pipe(plugins.concat('bundle.js'))
		.pipe(gulp.dest('dist/assets/js/'));

	// concat all bower css into vendor.css
	gulp.src(mainBowerFiles({includeDev: true}))
		.pipe(plugins.filter('**/*.css'))
		.pipe(plugins.concat('vendor.css'))
		.pipe(gulp.dest('dist/assets/css/'));
});
