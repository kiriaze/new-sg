'use strict';

var config         = require('../config'),
	gulp           = require('gulp'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	$              = require('gulp-load-plugins')();


// Copying non underscored json files
// For components like live search, etc.
gulp.task('json', function() {
	// exclude _data.json files from getting copied over to data dir
	return gulp.src([
		config.srcPaths.root + '/modules/**/*.json',
		config.srcPaths.root + '/pages/**/*.json',
		'!' + config.srcPaths.root + '/pages/**/_data.json',
		'!' + config.srcPaths.root + '/modules/**/_data.json'
		])
		.pipe($.flatten()) // remove directory structure, e.g. 01_introduction/file.json

		// unglob your paths, pass the file paths into gulp.src.
		// When gulp src receives unglobbed file paths the relative dir is not maintained and simply copies the file to the root of the dest dir you specify. It can also be useful to unglob your paths first if you need to do any custom filtering or appending before setting src.
		// gulp.task('copy-fonts', function() {
		// files = glob.sync('dependencies/**/*.{ttf,woff,eof,svg}');
		// gulp.src(files)
		// .pipe(gulp.dest(config.destPaths.root + '/assets/data'))
		// });

		.pipe(gulp.dest(config.destPaths.root + '/assets/data'))
});
