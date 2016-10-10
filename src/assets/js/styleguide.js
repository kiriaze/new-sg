// Outer iframe wrapper scripts

// used in conjuncture with styleguide's package.json and browserify-shim
var $ = global.jQuery = require('jquery');

var prism = require('./plugins/prism.js');

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

	SG.sgApi = function(){

		// use wp api
		// maybe: https://github.com/kadamwhite/wordpress-rest-api
		var url = 'http://162.243.138.74/wp-json/wp/v2/module'; // custom post type

		// get all of it
		// parse it
		// store it locally
		// curl it
		$.getJSON( url, function( data ) {

			// for default wysiwyg
			// console.log(data[0].content.rendered);
			// var content = $(data[0].content.rendered).text();

			// console.log(data);

			$.each( data, function( key, val ) {

				// console.log(key,val.acf);

				var meta            = val.acf,
					$iframe			= $('iframe'),
					$sgModParagraph	= $iframe.contents().find('[data-scroll-target="'+ val.slug +'"]').find('.styleguide-module__paragraph');

				for ( var key in meta ) {

					if ( meta.hasOwnProperty(key) ) {

						var comment = [
							'<div class="'+ key +'">',
								meta[key],
							'</div>'
						].join('');

						// <ul class="tabs">
						// 	<li class="is-active">
						// 		<a href="javascript:;">Tab 1</a>
						// 	</li>
						// 	<li>
						// 		<a href="javascript:;">Tab 1</a>
						// 	</li>
						// </ul>
						// <ul class="tab-content">
						// 	<li class="is-active">
						// 	</li>
						// 	<li>
						// 	</li>
						// </ul>

						// console.log(comment);

						$sgModParagraph.after(comment);

					}

				}

			});

		});

		setTimeout(function() {

			var $pre  = $('iframe').contents().find('[data-scroll-target] .basic_dev_comments').find('pre');
			var $code = $('iframe').contents().find('[data-scroll-target] .basic_dev_comments').find('code');

			$pre.addClass('language-markup');

			$code.text($code.html());

			Prism.highlightAll();

		}, 1000);

	};

	SG.ajaxPageNav = function() {

		$('#sg-nav').find('a').on('click', function(e){

			e.preventDefault();

			var $this       = $(this),
				origin		= window.location.origin,
				href		= $(this).attr('href'),
				newURL      = ($this.text().match('Mods')) ? '?styleguide=' + $this.text().slice(0, -5) : '?styleguide=global';

			$.get(origin + '/' + href, function(data) {
				// console.log(data);
				if ( href.slice(-15) !== 'customizer.html' ) {

					$('.styleguide-iframe-wrapper iframe').attr('src', href);

					history.pushState('', '', newURL);

					SG.sidebarNav();

					if ( $this.hasClass('sg--mods-link') ) {

						setTimeout(function() {
							$this.after($('.sidebar #nav'));
						}, 1000);

					}

				} else {
					window.open(href, '_top');
				}
			})
				.fail(function(){
					// console.log('nothing');
				});

		});
	};

	SG.sidebarToggle = function(){

		SG.elems.toggleSidebar.on('click',function(){
			SG.elems.body.add(SG.elems.html).toggleClass('sidebar-open');
		});

		var width = $window.width();

		// toggle sidebar on resize
		var sidebarToggle = function() {
			if ( width < 1220 ) {
				SG.elems.body.add(SG.elems.html).removeClass('sidebar-open');
			} else {
				SG.elems.body.add(SG.elems.html).addClass('sidebar-open');
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

		var pathname = window.location.pathname; // Returns path only
		var url      = window.location.href;     // Returns full URL
		// console.log(pathname, url);

		// if mobile styleguide, resize window to tiny,
		// and clicking on any breakpoint takes you back to full styleguide
		if ( pathname == '/m-index.html' ) {

			$('iframe').attr('data-breakpoint-size', 'tiny');
			SG.elems.headerBreakpoints.find('a').on('click', function(e) {
				window.location = '/';
			});

		} else {

			SG.elems.headerBreakpoints.find('a').on('click', function(e) {
				var size = $(this).data('breakpoint-size');
				SG.elems.headerBreakpoints.find('a').removeClass('active');
				$(this).addClass('active');
				$('iframe').attr('data-breakpoint-size', size);
			});

		}
	};

	SG.sidebarNav = function(){

		if ( ! $('.sidebar').length ) {
			// hack, move the sidebar out of iframe
			SG.elems.header.after(frames[0].$('.sidebar'));
		} else {
			$('.sidebar #nav').html(frames[0].$('.sidebar').find('#nav').html());
		}

		// overwrite scrolling function of simpleAnchors because of iframe
		$('[data-scroll-to]').on('click',function(e){

			var target = $(this).data('scroll-to'),
				dest   = $('iframe').contents().find('[data-scroll-target=\"' + target + '\"]');

			frames[0].$('html, body').animate({
				scrollTop: dest.offset().top
			}, 800, 'easeInOutCubic');

		});

	};

	function getParameterByName(name, url) {

		if ( ! url ) url = window.location.href;

		name        = name.replace(/[\[\]]/g, "\\$&");

		var regex	= new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results	= regex.exec(url);

		if ( !results ) return null;

		if ( !results[2] ) return '';

		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	$window.load(function() {

		SG.elems.body.addClass('loaded');

		var field			= 'styleguide';
		var url				= window.location.href;
		var styleguideURL	= getParameterByName('styleguide') + '/styleguide.html';

		if ( url.indexOf('?' + field + '=') != -1 ) {
			$('.styleguide-iframe-wrapper iframe').attr('src', styleguideURL);
			setTimeout(function() {
				console.log($('#sg-nav').find('a[href='+ styleguideURL +']'), styleguideURL);
				$('#sg-nav').find('a[href^="/'+ styleguideURL +'"]').after($('.sidebar #nav'));
			}, 350);
		}

	});

	// subsequent times
	$('iframe').load(function() {

		var iframe = this;

		SG.sidebarNav();

		setTimeout(function() {
			SG.ajaxPageNav();
		}, 350);

		// get body class
		var bodyClass = $('body').attr('class');

		// remove sidebar class from body
		// var newBodyClass = bodyClass.replace('sidebar-open', '');
		var newBodyClass = '';

		// attach loaded and parent body class to iframe body
		frames[0].$('body').addClass('loaded ' + newBodyClass);

	});

	$window.resize(function(event) {

	});

	$(document).ready(function(){
		SG.init();
	});

})(window.jQuery);
