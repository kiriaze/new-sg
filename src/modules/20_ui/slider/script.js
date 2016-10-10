
const Slider = require('./hooters/slider.js');

window.SETTINGS.addDomScanListener(function ($scanContainer) {


	window.SETTINGS.initElement($scanContainer, '[data-slider]', function() {

		var options = {
			stagePadding: 330,
			margin: 0,
			items: 1,
			loop: true,
			smartSpeed: 450,
			fluidSpeed: 450,
			dragEndSpeed: 450,

			dots: true,
			dotsContainer: '.bullet-nav',
			dotsContainerTemplate: '.bullet-nav-template'
		};

		new Slider(this, options);

	});

	window.SETTINGS.initElement($scanContainer, '[data-slider-linked]', function() {

		var $slider		= this.find('.owl-carousel');
		var $thumbs		= this.find('.thumbs');
		var animation	= $slider.data('animation-style') ? $slider.data('animation-style') : false;

		console.log(animation);

		var owl = $slider.owlCarousel({
			items: 1,
			dots: false,
			mouseDrag: false,
			touchDrag: false,
			pullDrag: false,
			animateOut: animation
		});

		$thumbs.on('click', 'a', function(event) {
			var idx = $(this).index();
			$thumbs.find('a').removeClass('is-active');
			$(this).addClass('is-active');
			$slider.trigger('to.owl.carousel', [idx, 200, true]);
		});

	});

});
