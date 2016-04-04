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
 *   gulp deploy-stage
 *   gulp deploy-prod
 *
 ******************************************************************************/

gulp.task('deploy-stage', ['prod'], function() {

	return gulp.src([config.destPaths.root])
		.pipe(rsync({
			root: config.destPaths.root,
			// ssh: true,
			hostname: config.staging.hostname,
			username: config.staging.username,
			password: config.staging.password,
			destination: config.staging.destination,
			recursive: true,
			incremental: true,
			progress: true,
			exclude: config.staging.exclude
		}));

});

gulp.task('deploy-prod', ['prod'], function() {

	return gulp.src([config.destPaths.root])
		.pipe(rsync({
			root: config.destPaths.root,
			// ssh: true,
			hostname: config.production.hostname,
			username: config.production.username,
			password: config.production.password,
			destination: config.production.destination,
			recursive: true,
			incremental: true,
			progress: true,
			exclude: config.production.exclude
		}));

});



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

	// Staging
	if ( argv.staging ) {

		rsyncConf.hostname		= config.staging.hostname;
		rsyncConf.username		= config.staging.username;
		rsyncConf.password		= config.staging.password;
		rsyncConf.destination	= config.staging.destination;
		rsyncConf.exclude		= config.staging.exclude;

	// Production
	} else if ( argv.production ) {

		rsyncConf.hostname		= config.production.hostname;
		rsyncConf.username		= config.production.username;
		rsyncConf.password		= config.production.password;
		rsyncConf.destination	= config.production.destination;
		rsyncConf.exclude		= config.production.exclude;

	// Missing/Invalid Target
	} else {
		throwError('deploy', gutil.colors.red('Missing or invalid target'));
	}

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
