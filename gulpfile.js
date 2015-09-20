'use strict';

var gulp           = require('gulp'),
	browserSync    = require('browser-sync'),
	bs             = browserSync.create(),
	del            = require('del'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	plugins        = require('gulp-load-plugins')(),
	path           = require('path'),
	mainBowerFiles = require('main-bower-files'),
	browserify     = require('browserify'),
	source         = require('vinyl-source-stream'),
	buffer         = require('vinyl-buffer'),
	runSequence    = require('run-sequence'),
	glob           = require('glob'),
	fs             = require('fs'),
	es             = require('event-stream');

// Notes:
// Consider https://github.com/assemble/assemble
//
// This styleguide works as a standalone
// but can possibly be included within your project
// and separated by example below
// gulpfile.js in your main project:
	// require('./gulp');
	// require('./styleguide/gulp');


// -------------------------------------------------------------
// Config
// -------------------------------------------------------------
var config = {

	'serverport': 3000,

	'styles': {
		'src' : 'src/assets/scss',
		'dest': 'dist/assets/css',
		'order': []
	},

	'scripts': {
		'src' : 'src/assets/js',
		'dest': 'dist/assets/js',
		'order': [
			'**/**/jquery.js',
			'**/**/jquery.easing.js',
			'**/**/*.js'
		]
	},

	// gh-pages default pushes to gh-pages branch.
	// remoteUrl: '', By default gulp-gh-pages assumes the current working directory is a git repository and uses its remote url. If your gulpfile.js is not in a git repository, or if you want to push to a different remote url ( username.github.io ), you can specify it. Ensure you have write access to the repository.
	// set branch to master for username.github.io
	// set source to what dir you want to push to github
	'githubPages': {
		'remoteUrl'	: '',
		'branch'	: '',
		'source'	: 'dist/**/*'
	},

	'bowerDir' : 'src/assets/vendor' ,

	'src' : {
		'root' : 'src'
	},

	'dist': {
		'root'  : 'dist'
	}
}

// GH Pages
var options = {
    remoteUrl: config.githubPages.remoteUrl,
    branch: config.githubPages.branch
};

gulp.task('gh-pages', function() {
	return gulp.src(config.githubPages.source)
		.pipe(plugins.ghPages(options));
});


// Init/install Bower
gulp.task('bower', function() {
	return plugins.bower(config.bowerDir)
    	.pipe(gulp.dest(config.bowerDir))
});

// Start browserSync server
// lsof -i tcp:3000
// kill -9 PID
gulp.task('browserSync', function() {
	// Now init the Browsersync server
	bs.init({
		server: {
			baseDir: config.dist.root
		},
		port: config.serverport
		// Can't have both server and proxy, pick one.
		// proxy: {
		// 	target: 'http://site.dev'
		// }
	});
});

// parted out mainbowerfiles into its own function
gulp.task('mbf', function () {
	gulp.src(mainBowerFiles({includeDev: true}).filter(function (f) { return f.substr(-2) === 'js'; }))
		// .pipe(plugins.order(config.scripts.order))
		.pipe(plugins.uglify())
		.pipe(plugins.concat('vendor.js'))
		.pipe(gulp.dest('dist/assets/js/'));
});


// Compile, concat, minify, autoprefix and sourcemap SCSS + bower
gulp.task('sass', function() {

	var files = [config.styles.src + '/main.scss', config.styles.src + '/modules.scss'];

	return gulp.src(files)
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass({
				outputStyle: 'compressed'
			}).on('error', plugins.sass.logError))
			.pipe(plugins.autoprefixer('last 2 versions'))
			.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(config.styles.dest))
		.pipe(plugins.filter('**/*.css')) // filters out css so browsersync css injection can work with sourcemaps
		.pipe(bs.reload({stream: true}));
});

// Hack the ability to import directories in Sass into newly created modules.scss file automatically
gulp.task('sass-includes', function () {

	var modStyle = 'style.scss';

	glob(config.src.root + '/modules/**/' + modStyle, function (error, files) {

		var content = [],
			finalContent;

		files.forEach(function (allModStyles) {

			var directory = path.dirname(allModStyles);

			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					path.basename(file) === modStyle
				)
			});

			content.push('@import "' + directory + '/' + partials + '";');

		});

		finalContent = content.join('\n');

		fs.writeFile(config.styles.src + '/modules.scss', finalContent);

	});

});

// Hack the ability to require scripts into newly created modules.js file automatically
gulp.task('js-includes', function () {

	var modStyle = 'script.js';

	glob(config.src.root + '/modules/**/' + modStyle, function (error, files) {

		var content = [],
			finalContent;

		files.forEach(function (allModStyles) {

			var directory = path.dirname(allModStyles);

			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					path.basename(file) === modStyle
				)
			});

			content.push('require("../../' + directory.replace('src/','') + '/' + partials + '");');

		});

		finalContent = content.join('\n');

		fs.writeFile(config.scripts.src + '/modules.js', finalContent);

	});

});

// watches all modules script.js files as well as the modules.js generated by js-includes
gulp.task('modules-js', function(){

	// modules scripts for partials output
	var files = glob.sync(config.scripts.src + '/modules.js', config.src.root + '/modules/**/script.js');

	var tasks = files.map(function(entry, output) {
		return browserify({
			entries: [entry],
			noParse: [config.bowerDir + '/jquery/dist/jquery.min.js'] // prevent lag by excluding scripts that dont 'require'
		})
			.bundle()
			.on('error', plugins.notify.onError(function (error) {
				return 'An error occurred while compiling js.\nLook in the console for details.\n' + error;
			}))
			.pipe(source('assets/js/modules.js'))
			.pipe(buffer())
				// Add transformation tasks to the pipeline here.
				.pipe(plugins.sourcemaps.init({loadMaps: true}))
					.pipe(plugins.uglify()) // slow
				.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest(config.dist.root))
			.pipe(bs.reload({stream: true}))
	});

});

// watches styleguide.js and iframe.js
gulp.task('styleguide-js', function() {

	// bundles
	var files = [
		config.scripts.src + '/styleguide.js',
		config.scripts.src + '/iframe.js'
	];

	var tasks = files.map(function(entry, output) {
		output = entry.replace('src/',''); // change entry/ouput
		return browserify({
			entries: [entry],
			noParse: [config.bowerDir + '/jquery/dist/jquery.min.js'] // prevent lag by excluding scripts that dont 'require'
		})
			.bundle()
			.on('error', plugins.notify.onError(function (error) {
				return 'An error occurred while compiling js.\nLook in the console for details.\n' + error;
			}))
			.pipe(source(output))
			.pipe(buffer())
				// Add transformation tasks to the pipeline here.
				.pipe(plugins.sourcemaps.init({loadMaps: true}))
					.pipe(plugins.uglify()) // super slow due to jquery and such
				.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest(config.dist.root))
			.pipe(bs.reload({stream: true}))
	});

	// create a merged stream
	return es.merge.apply(null, tasks);

});

// Optimizing Images
gulp.task('images', function() {
	return gulp.src(config.src.root + '/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
		// Caching images that ran through imagemin
		.pipe(plugins.cache(plugins.imagemin({
			interlaced: true,
		})))
		.pipe(gulp.dest(config.dist.root + '/assets/images'))
});

// Copying fonts
gulp.task('fonts', function() {
	return gulp.src(config.src.root + '/assets/fonts/**/*')
		.pipe(gulp.dest(config.dist.root + '/assets/fonts'))
});

// CNAME
gulp.task('cname',function(){
	return gulp.src('CNAME')
		.pipe(gulp.dest(config.dist.root))
});

// Cleaning
gulp.task('clean', function() {
	del(config.dist.root);
	return plugins.cache.clearAll();
});

// json/jade root styleguide wrapper
gulp.task('styleguide', function() {

	var data = JSON.parse(fs.readFileSync('_data.json'));

	return gulp.src(config.src.root + '/*.jade')
		.pipe(plugins.jade({
			pretty: true,
			locals: data
		})
			.on('error', plugins.notify.onError(function (error) {
				return 'An error occurred while compiling jade.\nLook in the console for details.\n' + error;
			}))
		)
		.pipe(gulp.dest(config.dist.root))
});

// json/jade styleguide modules
gulp.task('modules', function() {
	return gulp.src(config.src.root + '/modules/**/html.jade')
		.pipe(plugins.data(function(file) {
			// console.log(file.path);
			return JSON.parse(fs.readFileSync(path.dirname(file.path) + '/_data.json'));
		}))
		.pipe(plugins.jade({
			pretty: true
		})
			.on('error', plugins.notify.onError(function (error) {
				return 'An error occurred while compiling jade.\nLook in the console for details.\n' + error;
			}))
		)
		.pipe(plugins.concat('modules.html'))
		.pipe(gulp.dest(config.src.root))
});

// Watchers
gulp.task('watch', function() {

	// utilizing browsersync.watch - much faster than gulp.watch

	// scss
	bs.watch(config.src.root + '/**/*.scss', function (event, file) {
		if ( event === 'change' ) {
			runSequence('sass')
			bs.reload('*.css'); // for injection only
		}
	});

	// js
	bs.watch(config.src.root + '/**/*.js', function (event, file) {
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('modules-js', 'styleguide-js', bs.reload)
		}
	});

	// images
	bs.watch(config.src.root + '/assets/images/**/*', function (event, file) {
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('images', bs.reload)
		}
	});

	// only modules
	bs.watch([
		config.src.root + '/modules/**/*.jade',
		config.src.root + '/modules/**/*.json'
	], function(event, file){
		if ( event === 'change' ) {
			// required to run jade after for update of modules.html
			runSequence('modules', 'styleguide', bs.reload)
		}
	});

	// styleguide structure
	bs.watch([
		config.src.root + '/*.jade',
		config.src.root + '/templates/*.jade',
		'_data.json'
	], function(event, file){
		if ( event === 'change' ) {
			runSequence('styleguide', bs.reload)
		}
	});

});

// ---------------
// Build Sequences
// ---------------

// output last build date into styleguide
gulp.task('build-date', function(){

	var d = new Date();
	// format in MM/DD/YYYY
	var datestring = '0' + (d.getMonth()+1) + "-" + d.getDate()  + "-" + d.getFullYear();
	// console.log(datestring);

	// write to json
	var data = JSON.parse(fs.readFileSync('_data.json'));

	if ( data && typeof data.clientName !== 'undefined' ) {
		data.date = datestring;
		fs.writeFileSync('_data.json', JSON.stringify(data, null, 2));
	}

});

gulp.task('default', function() {
	runSequence(
		'clean',
		'bower',
		'mbf',
		'modules',
		'styleguide',
		'sass',
		'sass-includes',
		'styleguide-js',
		'modules-js',
		'js-includes',
		'images',
		'fonts',
		'cname',
		'build-date',
		'browserSync',
		'watch'
	)
});
