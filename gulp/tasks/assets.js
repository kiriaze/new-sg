// audio, video, images, fonts and optimg

'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	$		       = require('gulp-load-plugins')(),
	mainBowerFiles = require('main-bower-files'),
	browserSync    = require('browser-sync');

// audio
gulp.task('audio', function() {
	return gulp.src(config.srcPaths.audio)
		.pipe(gulp.dest(config.destPaths.audio))
		.pipe(browserSync.reload({stream:true}))
});


// fonts
gulp.task('fonts', function() {

	var files = mainBowerFiles('**/*.{eot,svg,ttf,woff,woff2}');
	console.log('font bower files: ', files);

	files.push(config.srcPaths.fonts);

	return gulp.src(files)
		.pipe($.changed(config.destPaths.fonts)) // Ignore unchanged files
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(config.destPaths.fonts))
		.pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});


// Image tasks
gulp.task('images', function() {
	return gulp.src(config.srcPaths.images)
		.pipe(gulp.dest(config.destPaths.images))
		.pipe(browserSync.reload({stream:true}))
});


// only runs on prod
gulp.task('optimg', function() {
	return gulp.src(config.srcPaths.images)
		.pipe($.changed(config.destPaths.images)) // Ignore unchanged files
		.pipe($.imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(config.destPaths.images))
});


// video
gulp.task('video', function() {
	return gulp.src(config.srcPaths.video)
		.pipe(gulp.dest(config.destPaths.video))
		.pipe(browserSync.reload({stream:true}))
});
