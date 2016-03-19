'use strict';

module.exports = {

	serverport: 3000,

	debugMode: true,

	bowerDir : 'src/assets/vendor' ,

	srcPaths: {
		root    : 'src',

		html    : 'src/**/*.html',
		partials: 'src/partials/**/*.{js,json,hbs}',
		helpers : 'src/assets/js/helpers/**/*.js',
		data    : 'src/data/**/*.{js,json}',

		styles  : 'src/assets/scss',
		scripts : 'src/assets/js/**/*.js',
		// js gulp order
		order   : [
			'**/**/modernizr.js',
			'**/**/jquery.js',
			'**/**/jquery.validate.js',
			'**/**/*.js'
		],
		images  : 'src/assets/images/**/*.{png,jpg,jpeg,gif,svg,ico}',
		video   : 'src/assets/video/**/*',
		fonts   : 'src/assets/fonts/**/*'
	},

	destPaths: {
		root    : 'dist',
		styles  : 'dist/assets/css',
		scripts : 'dist/assets/js',
		images  : 'dist/assets/img',
		video   : 'dist/assets/video',
		fonts   : 'dist/assets/fonts'
	},

	'uncss': {
		'ignore' : [
			// '#search-input',
			// '#results-container'
		]
	},

	// Google pagespeed
	'URL'       : 'http://domain.com',
	'strategy'  : 'mobile',

	'gzip': {
		'src': 'src/**/*.{html,xml,json,css,js,js.map}',
		'dest': 'dist/',
		'options': {

		}
	},

	// gulp deploy
	// set options here
	hostname: '',
	username: '',
	password: '',
	destination: 'public_html',
	exclude: [],

	// gh-pages default pushes to gh-pages branch.
	// remoteUrl: '', By default gulp-gh-pages assumes the current working directory is a git repository and uses its remote url. If your gulpfile.js is not in a git repository, or if you want to push to a different remote url ( username.github.io ), you can specify it. Ensure you have write access to the repository.
	// branch by default is gh-pages. set to master for username.github.io
	// set source to what dir you want to push to github
	githubPages: {
		remoteUrl : '',
		branch	  : '',
		source	  : 'dist/**/*'
	}

};
