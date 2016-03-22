// Outer iframe wrapper scripts

// used in conjuncture with styleguide's package.json and browserify-shim
var $ = global.jQuery = require('jquery');

(function($){

	/* jshint devel:true */
	'use strict';

	window.STYLEGUIDE = {};

	var SG = window.STYLEGUIDE;

	var $window      = $(window),
		$body        = $(document.body),
		$html        = $(document.documentElement);

	SG.init = function(){

		SG.setElements();
		SG.basics();
		SG.sidebarToggle();
		SG.breakpointToggle();

	};

	SG.setElements = function(){
		SG.elems                   = {};

		// defaults
		SG.elems.html              = $('html');
		SG.elems.body              = $('body');

		SG.elems.toggleSidebar     = $('.toggle-sidebar');
		SG.elems.header            = $('.styleguide-header');
		SG.elems.headerBreakpoints = $('.styleguide-header-breakpoints');

	};

	SG.basics = function() {



	};

	SG.sidebarToggle = function(){
		SG.elems.toggleSidebar.on('click',function(){
			SG.elems.body.add(SG.elems.html).toggleClass('sidebar-open');
		});

		var width = $window.width();

		var sidebarToggle = function() {
			if ( width > 768 ) {
				SG.elems.body.add(SG.elems.html).addClass('sidebar-open');
			} else {
				SG.elems.body.add(SG.elems.html).removeClass('sidebar-open');
			}
		}

		sidebarToggle();

		$window.resize(function(e) {
			if ( $window.width() != width ) {
				// DO RESIZE
				width = $window.width();
				sidebarToggle();
			}
		});
	};

	SG.breakpointToggle = function(){
		SG.elems.headerBreakpoints.find('a').on('click', function(){
			var size = $(this).data('breakpoint-size');
			SG.elems.headerBreakpoints.find('a').removeClass('active');
			$(this).addClass('active');
			$('iframe').attr('data-breakpoint-size', size);
		});
	};

	$window.load(function() {
		SG.elems.body.addClass('loaded');
	});

	$('iframe').load(function() {
		// hack, move the sidebar out of iframe
		SG.elems.header.after(frames[0].$('.sidebar'));
	});

	$window.resize(function(event) {

	});

	$(document).ready(function(){
		SG.init();
	});

})(window.jQuery);
