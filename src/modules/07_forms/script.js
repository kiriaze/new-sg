const PlusMinusField = require('./controls/plus-minus-field'),
	  DragDropUpload = require('./fields/drag-drop-upload');

window.SETTINGS.addDomScanListener( function($scanContainer) {

	// custom selects

	window.SETTINGS.initElement($scanContainer, 'select.custom-select', function() {

		let hideActive = $(this).data('hide-active');

		$(this).selectize({
			allowEmptyOption: true,
			hideSelected: typeof hideActive !== typeof undefined && hideActive !== false
		});

		// disable input type/search
		$('.selectize-input input').prop('disabled', true);

	});

	// drag and drop

	window.SETTINGS.initElement($scanContainer, '[data-drag-drop-upload]', function () {
		new DragDropUpload(this);
	});

	// form validation (with pseudo page change submit)

	window.SETTINGS.initElement($scanContainer, '[data-validate]', function(){

		let $this = $(this);

		$this.validate({

			// selectize support
			ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',

			rules: {
				password: {
					required: true,
					minlength: 5
				},
				password2: {
					required: true,
					minlength: 5,
					equalTo: "#password"
				},
				phone: {
					required: true,
					digits: true,
					phoneUS: true
				}
			},

			errorPlacement: function(error, element) {
				error.insertBefore(element);
			},

			success: function(label, element) {
				label.addClass('valid').text(element.getAttribute('data-msg-success'));
			},

			showErrors: function(errorMap, errorList) {

				let $errorBlock		= $this.parents('.modal').find('.form-alert-block--error');
				let $messageSpan	= $errorBlock.find('span');

				if ( this.numberOfInvalids() > 0 ) {
					$messageSpan.html("No Bueno! Your form contains " + this.numberOfInvalids()	+ " errors, see details below.");
					$errorBlock.addClass('is-visible');
				} else {
					$errorBlock.removeClass('is-visible');
				}
				this.defaultShowErrors();
			},

			submitHandler: function(form) {

				let curVars 	= window.location.search; // returns path only
				let url      	= window.location.href; // returns full URL
				let newVars		= $this.data('url-vars') || ''; // specifically add url vars
				let removeVars	= $this.data('remove-vars') || ''; // specifically remove url vars
				let modalId		= $this.data('modal-id') || ''; // opens modal instead of refreshing page

				let mergedVarsObj = Utils.BrowserUtils.mergeURLParams(newVars, curVars);

				if ( removeVars ){

					let removeVarsObj = Utils.BrowserUtils.getUrlParameters(removeVars);

					for ( let key in removeVarsObj ){
						if ( typeof(mergedVarsObj[key]) !== 'undefined' ){
							delete mergedVarsObj[key];
						}
					}
				}

				if ( this.currentForm.dataset["dontSend"] ) {
					$(this.currentForm).addClass("data-sent")
				} else if(modalId){
					$.magnificPopup.open({
					  items: { src: '#' + modalId },
					  type: 'inline'
					});
				} else {
					location.href = url.split('?')[0] + '?' + Utils.BrowserUtils.param(mergedVarsObj);
				}
			}

		});
	});

	// link to add variable form url

	window.SETTINGS.initElement($scanContainer, '[data-add-vars]', function(){

		let $this = $(this);

		$this.on('click', (e) => {

			let curVars 	= window.location.search; 	// Returns path only
			let url      	= window.location.href;     // Returns full URL
			let newVars		= $this.data('url-vars') || '';

			let mergedVarsObj = Utils.BrowserUtils.mergeURLParams(newVars, curVars);
			location.href = url.split('?')[0] + '?' + Utils.BrowserUtils.param(mergedVarsObj);
		});

	});

	// link to remove variable form url

	window.SETTINGS.initElement($scanContainer, '[data-remove-vars]', function(){

		let $this = $(this);

		$this.on('click', (e) => {

			let curVars			= window.location.search; 	// Returns path only
			let url				= window.location.href;     // Returns full URL
			let removeVars		= $this.data('remove-vars') || '';

			let curVarsObj		= Utils.BrowserUtils.getUrlParameters(curVars);
			let removeVarsObj	= Utils.BrowserUtils.getUrlParameters(removeVars);

			for ( let key in removeVarsObj ){
				if ( typeof(curVarsObj[key]) !== 'undefined' ){
					delete curVarsObj[key];
				}
			}

			e.preventDefault();
			location.href = url.split('?')[0] + '?' + Utils.BrowserUtils.param(curVarsObj);
		});
	});

	// plus minus fields

	window.SETTINGS.initElement($scanContainer, '[data-plus-minus-field]', function(){

		let $this = $(this);
		let plusMinusField = new PlusMinusField($this, {});
	});

	// drop down where selected menu item changes initial label

	window.SETTINGS.initElement($scanContainer, '[data-select-dd-swap-label]', function(){

		let $this = $(this);
		let $select = $this.find('.custom-select');
		let selectizeControl = $select[0].selectize;
		let $label = $this.find('label');
		let $strong = $label.find('strong');

		if($label.length){

			// methods

			let updateLabel = () => {
				let title = selectizeControl.getItem($select.val()).text();
				$strong.html(title);
			}

			// listeners

			selectizeControl.on('change', () => {
				updateLabel();
			});

			selectizeControl.on('initialize', () => {
				updateLabel();
			});

			//

			window.requestAnimationFrame(() => {
				updateLabel();
			});
		}

	});

	//

	window.SETTINGS.initElement($scanContainer, '[data-cf-cost-form]', function(){

		// how-to:

		// displayed
		// [data-cf-cost-item] : anything that adds cost to the total
		// [data-cf-cost-selector] : custom selector that adds cost to the total
		// [data-cf-tax-item] : tax cost (added to total not subtotal)
		// [data-cf-cost-subtotal] : where to display subtotal
		// [data-cf-cost-total] : where to display total

		// non-displayed
		// [data-subtotal] : attr of $this - stores subtotal (not including tax)
		// [data-total] : attr of $this - stores total (includes tax)

		let $this			= $(this);

		let $inputs			= $this.find('input, textarea, select, [data-form-item]');
		let $costItems		= $this.find('[data-cf-cost-item], [data-cf-tax-item]');
		let $costSelectors	= $this.find('[data-cf-cost-selector]');
		let $taxItems		= $this.find('[data-cf-tax-item]');
		let $promoCodes		= $this.find('[data-promo-code]');
		let $menuBagItems	= $this.find('[data-menu-bag-item]');
		let $costSubTotal	= $this.find('[data-cf-cost-subtotal]');
		let $costTotal		= $this.find('[data-cf-cost-total]');
		let $zipTaxRow		= $this.find('[data-cf-zip-tax-row]');

		let currency		= $this.data('cf-cost-currency') || '$';
		let taxRate			= $this.data('cf-tax-rate') || 0.09;
		let tax				= 0;
		let discounts		= 0;
		let subTotal		= 0;
		let total			= 0;

		let debouncer		= null;

		// initialize zip tax rows

		$zipTaxRow.each((index, value) => {

			let $ztr		= $(value);
			let $zipField	= $ztr.find('[data-zip-input]');
			let $taxItem	= $ztr.find('[data-cf-tax-item]');
			let $button		= $ztr.find('button');

			let checkZip = () => {

				$this.validate().element($zipField);

				if ( $zipField.hasClass('valid') ) {
					$taxItem.attr('data-cf-valid', true);
				} else {
					$taxItem.removeAttr('data-cf-valid');
				}

				updateTotals();
			}

			$zipField.on('change keyup blur', () => {
				checkZip();
			});

			$button.on('click', (e) => {
				e.preventDefault();
				checkZip();
			});
		});

		// interactions with cost selectors

		$costSelectors.each((index, value) => {

			let $costSelector = $(value);
			let $costItem = $costSelector.find('[data-cf-cost-item]');
			let $select = $costSelector.find('select');

			let checkVal = () => {

				let cost = Utils.BrowserUtils.getUrlParameters($select.val()).cost;
				if(!cost){ cost = 0; }

				$costItem.text('$' + Utils.NumberUtils.formatNumber(cost, 0, 2, true));
			}

			$select.on('change', checkVal.bind(this));
		});

		// listen for promo code updates

		$promoCodes.on('change', (e) => {

			let $target 	= $(e.currentTarget);
			let $discount 	= $target.find('[data-pc-discount-item]');
			let number		= Number($discount.text().replace(/[^0-9\.\-]+/g,""));

			if(!$target.attr('data-applied') || $target.attr('data-applied') === 'false'){ number = 0; }

			$target.attr('data-cf-promo-discount', number);
			updateTotals();
		});

		//

		let onInputUpdate = (e, params) => {

			if ( !params || !params.silent ) {
				$this.triggerHandler('change', {
					silent: true
				});
			}

			updateTotals();
		}

		let updateTotals = () => {

			subTotal	= 0;
			tax			= 0;
			discounts 	= 0;

			$costItems.each((index, value) => {

				let $costItem	= $(value);
				let costText	= $costItem.text();
				let number		= Number(costText.replace(/[^0-9\.\-]+/g,""));

				if ( $costItem.attr('data-active') != 'false' ) {

					if ( typeof($costItem.data('cf-tax-item')) === 'undefined' ) {
						subTotal += number;
					}
				}
			});

			$menuBagItems.each((index, value) => {

				let $menuBagItem	= $(value);
				let totalCost		= parseFloat($menuBagItem.attr('data-mbi-total-cost'));

				if ( totalCost ) {
					subTotal += totalCost;
				}
			});

			$promoCodes.each((index, value) => {

				let $promoCode	= $(value);
				let discount	= parseFloat($promoCode.attr('data-cf-promo-discount'));

				if ( discount ) {
					discounts += discount;
				}
			});

			// adjust subtotal with discounts

			subTotal -= discounts;

			// calculate tax

			tax = subTotal * taxRate;

			// display tax

			let isTaxing = false;

			$taxItems.each((index, value) => {
				let $taxItem = $(value);
				if ( $taxItem.attr('data-cf-valid') ) {
					isTaxing = true;
					$taxItem.text('$' + Utils.NumberUtils.formatNumber(tax, 0, 2, true));
				} else {
					$taxItem.text('$' + Utils.NumberUtils.formatNumber(0, 0, 2, true));
				}
			});

			if ( !isTaxing ){
				tax = 0;
			}

			// calculate total

			total = subTotal + tax;

			// store total/subtotal as data attributes to make available for other mods

			$this.attr('data-cf-subtotal', subTotal);
			$this.attr('data-cf-total', subTotal + tax);

			// format totals with commas and currency

			$costSubTotal.text(currency + Utils.NumberUtils.formatNumber(subTotal, 0, 2, true));
			$costTotal.text(currency + Utils.NumberUtils.formatNumber(subTotal + tax, 0, 2, true));

		}

		// debounce updates to inputs

		debouncer = _.debounce(onInputUpdate, 250);

		// listen for changes

		$menuBagItems.on('change', updateTotals);

		$costItems.on('change', debouncer);
		$inputs.on('change', debouncer);
		$inputs.on('keyup', debouncer);

		// initial calculations

		updateTotals();
		$this.validate();

	});

	// zip input validation

	window.SETTINGS.initElement($scanContainer, '[data-zip-input]', function(){

		let $this = $(this);

		jQuery.validator.addMethod('zipcode', function(value, element) {
			return this.optional(element) || (value && value.length === 5 && !!value.trim().match(/^\d{5}(?:[-\s]\d{4})?$/));
		}, 'Invalid zip code');

	});

	// // phone
	// // supports: (123) 456 7899, (123).456.7899, (123)-456-7899, 123-456-7899, 123 456 7899, 1234567899
	// window.SETTINGS.initElement($scanContainer, '[data-phone-input]', function(){

	// 	let $this = $(this);

	// 	jQuery.validator.addMethod('phone', function(value, element) {
	// 		return this.optional(element) || (value && value.trim().match(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/));
	// 	}, 'Invalid phone number');

	// });

});
