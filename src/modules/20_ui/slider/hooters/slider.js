// ToDo:
// Define the type of each option; e.g. String
// Add description for each option?

let sliderCount = 0;

class Slider {

	constructor(el, options, cb) {

		this.options = options || {

			items: 3,
			loop: false,  // errors if true and only 1 item
			center: false,
			rewind: false,

			mouseDrag: true,
			touchDrag: true,
			pullDrag: true,
			freeDrag: false,

			margin: 0,
			stagePadding: 0,

			merge: false,
			mergeFit: true,
			autoWidth: false,

			startPosition: 0,
			rtl: false,

			smartSpeed: 250,
			fluidSpeed: 250,
			dragEndSpeed: 250,

			slideBy: 1,

			responsive: {},
			responsiveRefreshRate: 200,
			responsiveBaseElement: window,

			fallbackEasing: 'swing',

			URLhashListener: false,

			info: false,

			callbacks: true,

			nestedItemSelector: false,
			itemElement: 'div',
			stageElement: 'div',

			lazyLoad: false,

			autoplay: false,
			autoplaySpeed: false,
			autoplayTimeout: 5000,
			autoplayHoverPause: false,

			video: false,
			videoHeight: false,
			videoWidth: false,

			// css transitions / uses s-animate lib
			// disable slide if true
			animateOut: false,
			animateInClass: false,

			refreshClass: 'owl-refresh',
			loadedClass: 'owl-loaded',
			loadingClass: 'owl-loading',
			rtlClass: 'owl-rtl',
			responsiveClass: 'owl-responsive',
			dragClass: 'owl-drag',
			itemClass: 'owl-item',
			stageClass: 'owl-stage',
			stageOuterClass: 'owl-stage-outer',
			grabClass: 'owl-grab',

			nav: false,
			navText: [ 'prev', 'next' ],
			navSpeed: false,
			navElement: 'div',
			navContainer: false,
			navContainerClass: 'owl-nav',
			navClass: [ 'owl-prev', 'owl-next' ],

			dotClass: 'owl-dot',
			dotsClass: 'owl-dots',
			dots: true,
			dotsEach: false,
			dotsData: false,
			dotsSpeed: false,
			dotsContainer: false,

			// custom
			dotsContainerTemplate: false

		}

		this._setElems(el);
		this._init(cb);

		sliderCount++;
	}

	_setElems(el) {

		this.$el  = el;
		this.$nav = this.$el.siblings(this.options.dotsContainer);

		if ( !this.$nav.length ) {
			this.$nav = this.$el.siblings().find(this.options.dotsContainer);
		}

		// append slider count index for appropriate custom navigation
		// in multiple slider instances with same classname
		this.options.dotsContainer = this.options.dotsContainer + '-' + sliderCount;

		// append index based nav class
		this.$nav.addClass(this.options.dotsContainer.slice(1));

		// count slider items before owl init
		this.itemCount = this.$el.find(' > *').length;

	}

	_init(cb) {

		this._generateDotNav();

		// init owl
		this.$el.owlCarousel(this.options);

		// set owl data
		this.owl = this.$el.data('owlCarousel');

		//
		this._addEventListeners();

		if (cb) {
			setTimeout(cb, 100);
		}

	}

	// generate bullet navigation
	_generateDotNav() {

		var template	= this.$nav.find(this.options.dotsContainerTemplate);
		var item		= template.html();

		for ( var i = 0; i < this.itemCount; i++ ) {

			let dot = $(item);

			this.$nav.append(dot);

		}

		// for owl dot navigation issues
		template.remove();

	}

	_addEventListeners(){

		//
		this.$el.on('changed.owl.carousel', this.onChange.bind(this));

		if ( this.$nav ) {

			this.$nav.find('li').on('click', this.onBulletClick.bind(this));

			this.onChange();

		}

	}

	onChange(e) {

	}

	onBulletClick(e) {
		this.owl.to($(e.currentTarget).index());
	}

}

module.exports = Slider;
