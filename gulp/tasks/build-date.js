'use strict';

var gulp           = require('gulp'),
	fs             = require('fs');

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
