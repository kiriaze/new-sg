'use strict';

var config 		  = require('../config'),
	gulp          = require('gulp'),
	cp            = require('child_process'),
	browserSync   = require('browser-sync'),
	fs            = require('fs'),
	path          = require('path'),
	ms            = require('merge-stream'),
	es            = require('event-stream'),
	handlebars    = require('handlebars'),
	layouts       = require('handlebars-layouts'),
	through 	  = require('through2'),
	$	          = require('gulp-load-plugins')();

// check for empty json
function isJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

// check if it exists
function fileExists(filePath) {
	try {
		return fs.statSync(filePath).isFile();
	} catch (err) {
		return false;
	}
}

// json/hbs styleguide modules
gulp.task('modules', function(cb) {

	///////////////////////
	// default modules
	///////////////////////

	// Registering partials separately than $.hb() for injecting page mods into styleguide.html layout template
	var filenames = fs.readdirSync(config.srcPaths.root + '/partials');
	filenames.forEach(function (filename) {

		var matches = /^([^.]+).hbs$/.exec(filename);

		if ( ! matches ) return;

		var name     = matches[1],
			template = fs.readFileSync(config.srcPaths.root + '/partials/' + filename, 'utf8');

		handlebars.registerPartial(name, template);

	});

	///////////////////////

	// Grab all page directories to create sg page nav
	var dataPages   = [],
		customPages = [],
		content     = [
			'<li><a href="/global/styleguide.html" class="sg--mods-link">Global</a></li>'
		],
		finalContent,
		customizerLink,
		customLinks = [],
		// get dir names
		files       = fs.readdirSync('src/pages');

	files.forEach(function(file){

		var dataPath	   = config.srcPaths.root + '/pages/' + file + '/_data.json',
			customizerPath = config.srcPaths.root + '/pages/' + file + '/customizer.html';

		if (

			// if not a hidden file
			! /^\..*/.test(file) &&

			// does it exist?
			fileExists( dataPath ) &&

			// if is valid json, not empty
			isJson( fs.readFileSync( dataPath ) )

		) {

			// get page json
			var dataJson = JSON.parse(fs.readFileSync( dataPath ));
			// console.log( dataJson );

			// iterate over json
			// find pages array and store it
			// to create custom page links in the sidebar

			for ( var key in dataJson ) {

				if ( key == 'pages' ) {
					// dataPages['name'] = dataJson['name'];
					dataPages['name'] = file;
					for ( var i = 0; i < dataJson[key].length; i++ ) {
						dataPages.push(dataJson[key][i]);
					}
				}

			}

		}

	});

	// get custom pages from _data.json if set
	// e.g. custom states for a checkout page
	dataPages.forEach(function(page){

		var name     = dataPages['name'],
			pageName = page['pageName'],
			pageURL  = page['pageURL'];

		var obj = {
			name: name,
			pageName: pageName,
			pageURL: pageURL
		}

		customPages.push(obj);

	});

	// create the link items for custom pages
	customPages.forEach(function(page){
		// console.log(page.name);
		customLinks.push('<li><a href="'+ page.pageURL +'">' + page.pageName + '</a></li>');
	});

	// setup customizer, page and custom page links for each page
	files.forEach(function(file){

		// if not a hidden file & return files that dont start with 'm-'
		if ( ! /^\..*/.test(file) && file.substring(0, 2) != 'm-' ) {

			if ( fileExists( 'src/pages/' + file + '/' + 'customizer.html' ) ) {
				customizerLink = [
					'<li>',
						'<a href="'+ file +'/customizer.html">Page Customizer</a>',
					'</li>'
				].join('\n');
			}

			var pageNav = [
				'<li>',
					'<a href="/'+ file + '/' + 'styleguide.html" class="sg--mods-link">'+ file +' Mods</a>',
					'<ul>',
						'<li>',
							'<a href="'+ file +'">'+ file +' Page</a>',
						'</li>',
						customPages[0] && customPages[0]['name'] == file ? customLinks.join('') : '',
						customizerLink,
					'</ul>',
				'</li>'
			].join('\n');

			content.push(pageNav);

		}

	});

	// join them and output file
	finalContent = content.join('\n');
	fs.writeFile(config.srcPaths.root + '/partials/sg-nav.hbs', finalContent);

	///////////////////////

	cb();

	///////////////////////

});

// json/hbs in root of project / styleguide wrapper
gulp.task('styleguide', function() {

	return gulp.src(config.srcPaths.root + '/*.html')
		.pipe($.hb({
			// debug: true, // might not go here
			partials: config.srcPaths.partials,
			helpers: config.srcPaths.helpers,
			data: config.srcPaths.data.global
		})
			.on('error', $.notify.onError(function (error) {
				return 'An error occurred while compiling hbs.\nLook in the console for details.\n' + error;
			}))
		)
		.pipe(gulp.dest(config.destPaths.root))
});

// pages
gulp.task('pages', function() {

	// hb
	var hbStream = $.hb()

		// Partials
		.partials(config.srcPaths.partials)
		.partials(config.srcPaths.modules)

		// Helpers
		.helpers(config.srcPaths.helpers)

		// Data
		.data(config.srcPaths.data.global) // for global vars
		.data(config.srcPaths.root + '/modules/**/_data.json')

	return gulp.src([config.srcPaths.root + '/pages/**/*.html'])
		.pipe($.data(function(file) {
			// console.log(file.path, path.dirname(file.path));
			// check if valid, e.g. empty _data.json files
			if ( fileExists( path.dirname(file.path) + '/_data.json') ) {
				var file = fs.readFileSync(path.dirname(file.path) + '/_data.json');
				if ( isJson(file) ) return JSON.parse(file);
			}
		}))
		.pipe(hbStream)
			.on('error', $.notify.onError(function (error) {
				return 'An error occurred while compiling hbs.\nLook in the console for details.\n' + error;
			}))
		.pipe(gulp.dest(config.destPaths.root))

});

gulp.task('html', function() {
	if ( config.html.minify ) {
		return gulp.src(config.destPaths.root + '/**/*.html')
			.pipe($.htmlmin({
				collapseWhitespace: true,
				removeComments: true,
				conservativeCollapse: true,
				collapseBooleanAttributes: true,
				removeRedundantAttributes: true,
				minifyJS: true,
				// minifyCSS: true // has issues
			})
				.on('error', $.notify.onError(function (error) {
					return 'An error occurred while minifying html.\nLook in the console for details.\n' + error;
				}))
			)
			.pipe(gulp.dest(config.destPaths.root))
	}
});
