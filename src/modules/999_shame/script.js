/*===============================
=            FOR SHAME          =
===============================*/

(function($){

	/* jshint devel:true */
	'use strict';

	window.SHAME = {};

	var SHAME = window.SHAME;

	var $window      = $(window),
		$body        = $(document.body),
		$html        = $(document.documentElement);

	SHAME.init = function(){
		(function(l){var i,s={touchend:function(){}};for(i in s)l.addEventListener(i,s)})(document); // sticky hover fix in iOS
	};

	$(document).ready(function(){
		SHAME.init();
	});

})(window.jQuery);

/*====  End of FOR SHAME  =====*/


/*============================================
=            Example JS Functions            =
============================================*/

// // this is best
// // Locally scoped Object Literal

// var Module = (function () {

// 	// locally scoped Object
// 	var myObject = {};

// 	// declared with `var`, must be "private"
// 	var _privateMethod = function () {

// 	};

// 	myObject.someMethod = function () {
// 		// take it away Mr. Public Method
// 	};

// 	return myObject;

// })();


// // revealing pattern
// var Module = (function () {

// 	var _privateMethod = function () {
// 		// private
// 	};

// 	var someMethod = function () {
// 		// public
// 		_privateMethod();
// 	};

// 	var anotherMethod = function () {
// 		// public
// 	};

// 	return {
// 		someMethod: someMethod,
// 		anotherMethod: anotherMethod
// 	};

// })();






// (function( root, $, undefined ) {

// 	"use strict";

// 	$(function () {

// 		// DOM ready, take it away

// 		var tour = new tour();
// 		tour.init();
// 		tour.elems();

// 		alerts();

// 		function tour() {
// 			self.init = function() {
// 				console.log('tour init');
// 				foobar();
// 			}
// 			self.elems = function(){
// 				console.log('set elems');
// 			}
// 			function foobar() {
// 				console.log('foobar');
// 			}
// 			return self;
// 		}

// 		function alerts() {

// 			init();

// 			function init(){
// 				console.log('alerts init');
// 				elems();
// 			}

// 			function elems(){
// 				console.log('alerts elem init');
// 				foobar();
// 			}

// 			function foobar() {
// 				console.log('alerts foobar');
// 			}
// 		}

// 	});

// } ( this, jQuery ));




// (function( root, $, undefined ) {

// 	"use strict";

	// $(function () {

		// DOM ready, take it away


	// });

// } ( this, jQuery ));




// (function (root, factory) {
// 	if (typeof define === 'function' && define.amd) {
// 		define(factory);
// 	} else if (typeof exports === 'object') {
// 		module.exports = factory;
// 	} else {
// 		root.MYPROJECT = factory();
// 	}
// })(this, function () {

// 	'use strict';

// 	var exports = {};

// 	exports.init = function () {};

// 	return exports;

// });


/*=====  End of Example JS Functions  ======*/
