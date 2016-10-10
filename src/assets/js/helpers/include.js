var config	= require('../../../../gulp/config');
fs			= require('fs');

module.exports.register = function (Handlebars, options) {
	options = options || {};

	// any file type with absolute path
	// pass in all possible params with rest operator
	Handlebars.registerHelper('include', function (path, ...params) {

		var contents = fs.readFileSync(path, 'utf8');

		return new Handlebars.SafeString(new Handlebars.compile(contents)(params[0].hash,{}));

	});

	// svg only with svg path predefined
	// still slow..
	Handlebars.registerHelper('svg', function (name, params) {

		name = config.srcPaths.vectors + '/' + name + '.svg';

		var attributes = '';

		if ( params.hash.classes ) {
			attributes += 'class="' + params.hash.classes + '"';
		}

		if ( params.hash.params ) {
			attributes += ' ' + params.hash.params;
		}

		var contents = fs.readFileSync(name, 'utf8').replace('<svg', '<svg ' + attributes);

		return new Handlebars.SafeString(contents);

	});

};
