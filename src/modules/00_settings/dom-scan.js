
/*

DomScan

// TODO

- Replace jQuery window.$vent events with events bound to this class.
- Split listeners / triggers into groups (avoid having to loop through every object every time).
- Example: domScan.on('groupname:triggername');
- Example: domScan.trigger('groupname:triggername');

Last edited 07.27.16 by David Robbins

*/

class DomScan {

	constructor(){

	}

	// private

	_validateScanContainer($scanContainer){

		if ( typeof($scanContainer) === 'undefined' || !$scanContainer || !( $scanContainer instanceof jQuery ) ) {
			$scanContainer = $('body');
		}

		return $scanContainer;
	};

	// public

	addDomScanListener(callback){

		let onDomUpdate = ((e, obj) => {
			let $scanContainer	= obj ? obj.$scanContainer : null;
			$scanContainer		= this._validateScanContainer($scanContainer);
			callback.apply(null, [$scanContainer]);
		});

		window.$vent.on('domUpdate', onDomUpdate.bind(this));
		onDomUpdate();
	};

	initElement($scanContainer, selector, callback){

		$scanContainer = this._validateScanContainer($scanContainer);
		$scanContainer.find(selector).each(function(){

			let $this = $(this);

			if ( !$this.data('ss-initialized') || $this.data('ss-initialized').indexOf(selector) < 0) {

				if(!$this.data('ss-initialized')){
					$this.data('ss-initialized', []);
				}

				$this.data('ss-initialized').push(selector);
				callback.apply($this);
			}
		});
	};
}

module.exports = DomScan;
