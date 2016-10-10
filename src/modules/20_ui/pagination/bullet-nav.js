class BulletNav {
	constructor(domElement, size) {

		this.$el = domElement;
		var item = this.$el.find('.bullet-nav-template').html();

		for ( var i = 0; i < size; i++ ) {

			let bullet = $(item);

			bullet.attr('data-index', i);
			this.$el.append(bullet);

		}

	}

	destroy() {
		this.$el.children("li").remove();
	}
}

module.exports = BulletNav;
