class Validate {
	constructor(domElement) {
		this.$el = domElement;
		let $this = this.$el;
		let that = this;

		$this.validate({

			rules: {
				password: {
					required: true,
					minlength: 5
				},
				password2: {
					required: true,
					minlength: 5,
					equalTo: "#password"
				}
			},

			errorPlacement: function(error, element) {
				error.insertBefore(element);
			},

			success: function(label, element) {
				label.addClass('valid').text(element.getAttribute('data-msg-success'));
			},

			showErrors: function(errorMap, errorList) {
				
				let $errorBlock = $this.parents('.modal').find('.form-alert-block--error');
				let $messageSpan = $errorBlock.find('span');

				if ( this.numberOfInvalids() > 0 ) {
					$messageSpan.html("No Bueno! Your form contains " + this.numberOfInvalids()	+ " errors, see details below.");
					$errorBlock.addClass('is-visible');
				} else {
					$errorBlock.removeClass('is-visible');
				}
				this.defaultShowErrors();
			},

			submitHandler: function(form) {

				let curVars 	= window.location.search; // Returns path only
				let url      	= window.location.href;     // Returns full URL
				let newVars		= $this.data('url-vars') || '';
				let removeVars	= $this.data('remove-vars') || '';

				let mergedVarsObj = Utils.BrowserUtils.mergeURLParams(newVars, curVars);

				if(removeVars){

					let removeVarsObj = Utils.BrowserUtils.getUrlParameters(removeVars);

					for(let key in removeVarsObj){
						if(mergedVarsObj[key]){
							delete mergedVarsObj[key];
						}
					}
				}
				if(that.onSubmit()) {
					location.href = url.split('?')[0] + '?' + Utils.BrowserUtils.param(mergedVarsObj);
				}
			}

		});
	}

	onSubmit() {
		return true;
	}
}

module.exports = Validate;