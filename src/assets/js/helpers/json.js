module.exports = {
	// print out json
	// {{json this}}
	'json': function (obj) {
		// return JSON.stringify(obj, null, 2);
		return JSON.parse(JSON.stringify(obj, null, 2));
	},
	// can pass inline data to partial
	// {{#parseJSON '{"items":[{"key": "hello", "label": "2015"}, {"key": "hello2", "label": "2015"}]}'}}
	// 	{{ this }}
	// {{/parseJSON}}
	'parseJSON': function(data, options) {
	   return options.fn(JSON.parse(data));
	}
};
