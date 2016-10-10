var config  = require('../config'),
	gulp 	= require('gulp'),
	rsync	= require('gulp-rsync'),
	gulpif  = require('gulp-if'),
	gutil   = require('gulp-util'),
	prompt  = require('gulp-prompt'),
	argv    = require('minimist')(process.argv);


/*******************************************************************************
 * Description:
 *
 *   Gulp file to push changes to remote servers (eg: staging/production)
 *
 * Usage:
 *
 *   gulp deploy --target
 *
 * Examples:
 *
 *   gulp deploy --production   // push to production
 *   gulp deploy --staging      // push to staging
 *
 ******************************************************************************/


gulp.task('deploy', ['prod'], function() {


	// Default options for rsync
	rsyncConf = {
		root        : config.destPaths.root,
		recursive   : true,
		incremental : true,
		progress    : true,
		exclude     : []
	};

	var deployFlag = false;

	// iterate over deploy array
	for ( var prop in config.deploy ) {

		if ( argv[prop] ) {

			// console.log(argv[prop], prop);

			rsyncConf.hostname		= config.deploy[prop].hostname;
			rsyncConf.username		= config.deploy[prop].username;
			rsyncConf.password		= config.deploy[prop].password;
			rsyncConf.destination	= config.deploy[prop].destination;
			rsyncConf.exclude		= config.deploy[prop].exclude;

			deployFlag = true;

			break;

		}

	}

	if ( ! deployFlag )
		throwError('deploy', gutil.colors.red('Missing or invalid target'));

	return gulp.src([config.destPaths.root])
		.pipe(gulpif(
			argv.production,
			prompt.confirm({
				message: 'Heads Up! Are you SURE you want to push to PRODUCTION?',
				default: false
			})
		))
		.pipe(rsync(rsyncConf));

});


function throwError(taskName, msg) {
	throw new gutil.PluginError({
		plugin: taskName,
		message: msg
	});
}
