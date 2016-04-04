// Iframe scripts
var prism        = require('./plugins/prism.js');

(function($){

	// console.log('iframe loaded');

	// fade in iframe body
	$('body').addClass('loaded');

	// SimpleAnchors
	$.simpleAnchors({
		offset: 75,
		easing: 'easeInOutCubic',
		autoBuild: true,
		sections: '.styleguide-module__title',	// the elements auto build targets to generate links from
		sectionEl: 'section class="module"',    // the elements auto build searchs for the section arg
		wrapper: '#module-wrapper',				// wrapper of all the auto build sections
		navEl: '#nav'
	});

	// tooltips for icons and other elements
	$('[data-tooltip]').hover(
		function() {
			var $this     = $(this),
				title     = $this.data('tooltip'),
				position  = $this.data('tooltip-position') ? $this.data('tooltip-position') : 'bottom',
				tooltip   = $( '<div class="tooltip '+position+'"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+title+'</div></div>' );

			$this.append( $( tooltip ) );

			if ( position === 'top' ) {
				tooltip.css({
					'top': - tooltip.height() - 10,
					'margin-left': - tooltip.width()/2
				});
			}

			if ( position === 'bottom' ) {
				tooltip.css({
					'margin-left': - tooltip.width()/2
				});
			}

			if ( position === 'left' ) {
				tooltip.css({
					'top': - tooltip.height()/4,
					'left': - tooltip.width() - 20
				});
			}

			if ( position === 'right' ) {
				tooltip.css({
					'top': - tooltip.height()/4,
					'right': - tooltip.width() - 20
				});
			}

			tooltip.addClass('in');

		}, function() {
			$( this ).find( ".tooltip" ).removeClass('in').remove();
		}
	);

	// overwrite scrollspy of simpleAnchors for iframe
	var scrollTimer = null;
	var $scrollTargets = $('[data-scroll-target]');

	$(window).scroll(function(e) {
		if ( scrollTimer ) {
			clearTimeout(scrollTimer);   // clear any previous pending timer
		}
		scrollTimer = setTimeout(scrollSpry, 20);   // set new timer
	});

	function scrollSpry(){

		var scrollPos = $(window).scrollTop();
		scrollTimer = null;

		$scrollTargets.each(function(e) {

			var currLink = $(this).data('scroll-target');

			if (
				( $(this).position().top <= scrollPos ) &&
				( $(this).position().top + $(this).outerHeight() > scrollPos )
			) {
				$('[data-scroll-to="'+ currLink +'"]', parent.document.body).addClass('active');
			} else {
				$('[data-scroll-to="'+ currLink +'"]', parent.document.body).removeClass('active');
			}

		});

	}

	var codeSnippets = function(){
		var codeToCreateSnippetClass = '.snippet',
			codeSnippetsClass        = '.styleguide-module__toggle-code';

		/**
		* Setup markup code snippet.
		* It gets the HTML of the element and creates the code area
		*/

		var options = {
			"indent":"auto",
			"indent-spaces":2,
			"wrap":80,
			"markup":true,
			"output-xml":false,
			"numeric-entities":true,
			"quote-marks":true,
			"quote-nbsp":false,
			"show-body-only":true,
			"quote-ampersand":false,
			"break-before-br":true,
			"uppercase-tags":false,
			"uppercase-attributes":false,
			"drop-font-tags":true,
			"tidy-mark":false,
			"quiet":"yes",
			"show-warnings":"no"
		};

		$.each($(codeToCreateSnippetClass), function(index, val) {
			// console.log($(val), val);
			var snippetClassName = codeToCreateSnippetClass.substr(1);
			var snippet = $(val)[0].outerHTML;
			$(val).before('<a href="javascript:;" class="' + codeSnippetsClass.replace('.', '') + '"></a>');
			$(val).after('<pre class="language-markup"><code>' + $('<p/>').text(snippet).html() + '</code></pre>').next().hide();
		});

		$(codeSnippetsClass).click(function(e) {
			e.preventDefault();
			var $code = $(this).next().next();
			// console.log($code);
			$code.toggle();
		});

		Prism.highlightAll();
	};

	codeSnippets();

})(window.jQuery);
