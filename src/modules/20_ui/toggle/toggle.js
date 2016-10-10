class SimpleToggle {

	constructor(el) {
		this.$el = el;
		this.$values = el.find('a');

		this.addEventListeners();
	}

	toggleOnClick(e) {
		let $el = $(e.currentTarget);

		this.$values.removeClass('is-active');
		$el.addClass('is-active');

		this.$el.trigger('change', $el.data('value'));
	}

	addEventListeners() {

		this.toggleOnClick = this.toggleOnClick.bind(this);

		this.$values.on('click', this.toggleOnClick);

	}

	removeEventListeners() {
		this.$values.off('click', this.toggleOnClick);
	}

}

module.exports = SimpleToggle;
