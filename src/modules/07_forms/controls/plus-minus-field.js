
// TODO
// param starting value, perhaps

class PlusMinusField {

	constructor($el, params){

		this.$el = $el;

		// elements

		this.$minusButton	= this.$el.find('.plus-minus-field--minus');
		this.$plusButton	= this.$el.find('.plus-minus-field--plus');
		this.$number		= this.$el.find('.plus-minus-field--number');
		this.$numberInput	= this.$number.find('input');

		// dom ready

		$(() => {
			this._onDomReady();
		});
	}

	_onDomReady(){
		this._addListeners();
		this.changeVal(parseInt(this.$numberInput.val()));
	}

	_addListeners(){

		this.$minusButton.on('click', this._onMinusClick.bind(this));
		this.$plusButton.on('click', this._onPlusClick.bind(this));

		this.$el.on('val', () => {
			this.$el.triggerHandler('change', {val:parseInt(this.$numberInput.val())});
		});
	}

	_onMinusClick(e){

		e.preventDefault();

		let count = parseInt(this.$numberInput.val());
		this.changeVal(count - 1);
	}

	_onPlusClick(e){

		e.preventDefault();

		let count = parseInt(this.$numberInput.val());
		this.changeVal(count + 1);
	}

	updateVal(newVal){
		this.$numberInput.val(newVal);
		this.$el.attr('data-val', newVal);
	}

	changeVal(newVal){

		if(newVal >= 1 && newVal <= 99){
			this.updateVal(newVal);
			this.$el.triggerHandler('change', {val:newVal});
		}
	}
}

module.exports = PlusMinusField;
