const Accordion              = require('./accordion/accordion'),
	  Tabs                   = require('./tabs/tabs'),
	  SimpleToggle           = require('./toggle/toggle');
require('./alerts/alerts');

window.SETTINGS.addDomScanListener(function ($scanContainer) {

	window.SETTINGS.initElement($scanContainer, '[data-accordion]', function () {
		new Accordion(this);
	});

	window.SETTINGS.initElement($scanContainer, '[data-heart-toggle]', function () {

		let $this = $(this);

		$this.on('click', () => {

			if ( $this.hasClass('is-active') ) {
				$this.removeClass('is-active');
			} else {
				$this.addClass('is-active');
			}
		});
	});

	window.SETTINGS.initElement($scanContainer, '.toggle', function () {
		new SimpleToggle(this);
	});

});
