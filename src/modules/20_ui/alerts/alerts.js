// alerts

window.SETTINGS.addDomScanListener(function ($scanContainer) {

	window.SETTINGS.initElement($scanContainer, '[data-alert]', function(){

		var $this = $(this);

		$this.on('click', '[data-alert-close]', function(e){
			$this.fadeTo(300, 0.001).slideUp();
		});

	});

});
