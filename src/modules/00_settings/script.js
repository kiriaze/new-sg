(function($){

	/* jshint devel:true */
	'use strict';

	window.SETTINGS = {};

	var SS = window.SETTINGS;

	var $window      = $(window),
		$body        = $(document.body),
		$html        = $(document.documentElement);

	SS.init = function(){

		SS.setElements();
		SS.colors();
		SS.basics();
		SS.forms();

	};

	SS.setElements = function(){
		SS.elems               = {};

		// defaults
		SS.elems.html          =	$('html');
		SS.elems.body          =	$('body');
		SS.elems.scrollToTop   =	$('a[data-scroll-to="top"]');

		SS.elems.exampleForm   = $('#example-form');

	};

	SS.colors = function() {
		var colors = {
			aqua    : '#7FDBFF',
			blue    : '#0074D9',
			lime    : '#01FF70',
			navy    : '#001F3F',
			teal    : '#39CCCC',
			olive   : '#3D9970',
			green   : '#2ECC40',
			red     : '#FF4136',
			maroon  : '#85144B',
			orange  : '#FF851B',
			purple  : '#B10DC9',
			yellow  : '#FFDC00',
			fuchsia : '#F012BE',
			gray    : '#aaa',
			white   : '#fff',
			black   : '#111',
			silver  : '#ddd'
		};
		// console.log(colors);
		// console.log(colors.blue);
	};

	SS.basics = function() {

		// SimpleAnchors
		$.simpleAnchors({
			offset: -1, // 80-1, header height on scroll
			easing: 'easeInOutCubic'
		});

	};

	SS.forms = function() {

		if ( ! SS.elems.exampleForm.length ) return;

		// debugging validator, prevents form submit
		$.validator.setDefaults({
			debug: true,
			success: "valid"
		});

		// Form Validation
		if ( $().validate ) {

			SS.elems.exampleForm.validate({
				rules: {
					password: {
						required: true,
						minlength: 5
					},
					password2: {
						required: true,
						minlength: 5,
						equalTo: "#password"
					}
				},
			});

			SS.elems.exampleForm.removeAttr('novalidate');

		}

	};

	$window.load(function() {

	});

	$window.resize(function(event) {

	});

	$(document).ready(function(){

		SS.init();

	});

})(window.jQuery);
