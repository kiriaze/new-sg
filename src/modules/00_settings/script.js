let ScrollAnimations 	= require('./scroll-animations.js');
let DomScan 			= require('./dom-scan.js');

require('./polyfill.js');

(function($){

	/* jshint devel:true */
	'use strict';

	// global var buckets (public)

	window.SETTINGS             = {};

	// global utility vars (private)

	window.SETTINGS._scrollAnimations;
	window.SETTINGS._domScan;

	// internal vars

	let $window						= $(window),
		$body						= $(document.body),
		$html						= $(document.documentElement),
		SS 							= window.SETTINGS;

	// global communications object

	if ( typeof(window.$vent) === 'undefined' ) {
		window.$vent = $('<div></div>');
	}

	//

	SS.init = function(){

		SS.globalVars();
		SS.globalObjects();
		SS.globalElements();
		SS.basics();
		SS.listeners();
	};

	SS.globalVars = function(){

		// coords

		SS.coords = {};
		SS.coords.breakpoints		= [480, 640, 1024, 1280, 1480, 1700];

		SS.coords.screenTiny		= 480;
		SS.coords.screenSmall		= 640;
		SS.coords.screenMedium		= 1024;
		SS.coords.screenLarge		= 1280;
		SS.coords.screenXLarge		= 1480;
		SS.coords.screenXXLarge		= 1700;

		// colors

		SS.colors = {
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

		// modals

		SS.modals		= {};

		// global variables (use sparingly)

		SS.vars 		= {};
	};

	SS.globalObjects = function(){

		SS._scrollAnimations 		= new ScrollAnimations();

		// domscan

		SS._domScan 				= new DomScan();
		SS.addDomScanListener		= SS._domScan.addDomScanListener.bind(SS._domScan);
		SS.initElement 				= SS._domScan.initElement.bind(SS._domScan);
	}

	SS.globalElements = function(){

		SS.elems               = {};

		// defaults
		SS.elems.html          = $('html');
		SS.elems.body          = $('body');
	};

	SS.basics = function() {

		// SimpleAnchors
		$.simpleAnchors({
			offset: -1, // 80-1, header height on scroll
			easing: 'easeInOutCubic'
		});

	};

	SS.listeners = function(){

		let triggerResizeEvent = ((e) => {

			var coords				= window.SETTINGS.coords;
			coords.winWidth			= window.innerWidth;
			coords.winHeight		= window.innerHeight;
			coords.docWidth			= $('body').outerWidth();
			coords.viewportWidth	= Math.min(coords.screenXXLarge, $('body').outerWidth());
			coords.scrollbarWidth	= coords.winWidth - coords.docWidth;

			window.$vent.triggerHandler('windowResize', {originalEvent:e});
		});

		// super duper throttled window resize event listener

		let resizeThrottler = _.throttle(triggerResizeEvent, 400);

		$window.on('resize', resizeThrottler);
		$window.on('orientationchange', resizeThrottler);
		$window.on('load', resizeThrottler);

		window.requestAnimationFrame(resizeThrottler);
	};

	//////////
	// init
	//////////

	SS.init();

})(window.jQuery);
