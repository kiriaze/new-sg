
window.SETTINGS.addDomScanListener(function ($scanContainer) {

	window.SETTINGS.initElement($scanContainer, '[data-z-group]', function () {

		let $this = $(this);

		let sortElements = () => {

			let lowZ = $this.data('low-z');
			let $zIndexElements = $this.find('[data-desc-z]');

			if(typeof(lowZ) === 'undefined'){ lowZ = 1; }

			let sortedZIndexElements = $zIndexElements.sort(

				function(a, b){

					let $a = $(a);
					let $b = $(b);
					let aOffset = $a.offset();
					let bOffset = $b.offset();

					if(aOffset.top < bOffset.top){
						return 1;
					}
					else if(aOffset.top == bOffset.top){

						if(aOffset.left < bOffset.left){ return -1; }
						else if(aOffset.left == bOffset.left){ return 0; }
						else { return 1; }
					}

					return -1;
				}
			);

			for(let i=0; i<sortedZIndexElements.length; i++){
				let $zIndexElement = $(sortedZIndexElements[i]);
				$zIndexElement.css('z-index', '');
				let zIndex = parseInt($zIndexElement.css('z-index')) || lowZ;
				$zIndexElement.css('z-index', zIndex+(i+1));
			}
		}

		window.$vent.on('domUpdate', (e, obj) => {
			if(obj && obj.$scanContainer[0] === $this[0]){
				sortElements();
			}
		});

		sortElements();

	});
});