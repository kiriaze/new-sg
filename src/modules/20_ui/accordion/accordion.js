class Accordion {

	constructor(el) {
		this.$el       = el;
		this.$toggles  = el.find('> * > .accordion--toggle');
		this.$contents = el.find('> * > .accordion--content');
		this.$window   = $(window);

		this.heights   = [];
		this.isOpen    = [];

		this.openClass = 'is-open';

		this.measure();
		this.addEventListeners();
	}

	measure() {
		this.heights = [];

		for (let e of this.$contents) {
			this.heights.push($(e).find('> div, > ul').outerHeight(true));
		}
	}

	setHeight(index, height = 0) {
		this.$contents.eq(index).css({'height': height});
	}

	open(index) {
		this.isOpen.push(index);
		this.$toggles.eq(index).parent().addClass(this.openClass);

		if (!this.heights[index]) {
			this.measure();
		}

		this.setHeight(index, this.heights[index]);
	}

	close(index) {
		this.isOpen = this.isOpen.filter(value => {
			return value != index;
		});

		this.$toggles.eq(index).parent().removeClass(this.openClass);
		this.setHeight(index);
	}

	togglesOnClick(e) {
		let $el   = $(e.currentTarget),
			index = $el.parent().index();

		$el.parent().hasClass(this.openClass) ? this.close(index) : this.open(index);
	}

	windowOnResize() {
		this.measure();
		for (let index of this.isOpen) {
			this.setHeight(index, this.heights[index]);
		}
	}

	addEventListeners() {
		this.togglesOnClick = this.togglesOnClick.bind(this);
		this.windowOnResize = this.windowOnResize.bind(this);

		this.$toggles.on('click', this.togglesOnClick);
		this.$window.on('resize', this.windowOnResize);
	}

	removeEventListeners() {
		this.$toggles.off('click', this.togglesOnClick);
		this.$window.off('resize', this.windowOnResize);
	}

}

module.exports = Accordion;
