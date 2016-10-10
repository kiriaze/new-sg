window.SETTINGS.addDomScanListener(function($scanContainer) {

	window.SETTINGS.initElement($scanContainer, '[data-type="tabs"]:not([data-tabs-nested])', function() {

		const $this	   = $(this),
			  $tab	   = $this.find('[data-tab]'),
			  $content = $this.find('[data-tab-content]');

		//  Add active states to first tab and link

		let firstTabType = $tab.eq(0).data('tab');
		$tab.eq(0).addClass('is-active');

		if ( firstTabType ) {
			$content.filter('[data-tab-content="' + firstTabType + '"]').addClass('is-active');
		} else {
			$content.eq(0).addClass('is-active');
		}

		//

		$tab.on('click', function(e) {

			const $el = $(this);

			e.preventDefault();

			if ( $el.is('.is-active') ) return;

			$tab.removeClass('is-active');
			$content.removeClass('is-active');

			$el.addClass('is-active');
			$content.filter('[data-tab-content="' + $el.data('tab') + '"]').addClass('is-active');

		});

	});

	// nested tabs cuz this shit is so fucking gay - fuck you designers, wtf are you thinking - god damn nested tabs - bullshit ronnie god damn bullshit
	window.SETTINGS.initElement($scanContainer, '[data-type="tabs"][data-tabs-nested]', function() {

		const $this	   = $(this),
			  $tab	   = $this.find('> * > [data-tab]'),
			  $content = $this.find('> [data-tab-content]');

		//  Add active states to first tab and link

		let firstTabType = $tab.eq(0).data('tab');
		$tab.eq(0).addClass('is-active');

		if ( firstTabType ) {
			$content.filter('[data-tab-content="' + firstTabType + '"]').addClass('is-active');
		} else {
			$content.eq(0).addClass('is-active');
		}

		//

		$tab.on('click', function(e) {

			const $el = $(this);

			e.preventDefault();

			if ( $el.is('.is-active') ) return;

			$tab.removeClass('is-active');
			$content.removeClass('is-active');

			$el.addClass('is-active');
			$content.filter('[data-tab-content="' + $el.data('tab') + '"]').addClass('is-active');

		});

	});

});
