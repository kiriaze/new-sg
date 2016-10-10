
if(typeof(Utils) === 'undefined' || !Utils){ Utils = {}; }

Utils.NumberUtils = {

	addCommas: function(num) {
		var numString = String(num);
		if(numString.length > 3){
			var numCommas = parseInt((numString.length-1)/3);
			for(var i=1; i<=numCommas; i++){ 
				numString = numString.substring(0, numString.length - 3*i - (i-1)) + "," + numString.substr(numString.length - 3*i - (i-1)); 
			}
		}
		return numString;
	},
		
	// add leading / trailing zeroes
	
	formatNumber: function(value, minUnitPlaces, maxDecimalPlaces, addCommas) {
		
		// default values

		if(typeof minUnitPlaces == 'undefined'){ minUnitPlaces = 0; }
		if(typeof maxDecimalPlaces == 'undefined'){ maxDecimalPlaces = 0; }
		if(typeof addCommas == 'undefined'){ addCommas = true; }

		// 

		var numParts = value.toString().split("."); 
		var units = "";
		var decimals = "";
		
		// decimals
		
		if(numParts.length > 1){ decimals = numParts[1]; }
		while(decimals.length < maxDecimalPlaces){ decimals += "0"; }
		
		// units
		
		units = numParts[0];

		while(units.length < minUnitPlaces){ units = "0" + units; }

		// return combined value

		var returnValue = (decimals == "") ? units : units + "." + decimals.substr(0, maxDecimalPlaces);
		if(addCommas == true){ this.addCommas(returnValue); }
		
		return returnValue;
	},
	
	// change number of decimals places
	
	setDecimalPlaces: function(value, decimalPlaces) {
		
		// default values

		if(typeof decimalPlaces == 'undefined'){ decimalPlaces = 2; }

		// 

		var power = Math.pow(10, decimalPlaces);
		return Math.floor(value * power) / power;
	},
	
	// convert boolean to int 
	
	boolToInt: function(bool) {
		return parseInt(bool);	
	},
	
	// get number within wrapped range (less than 0 is max - diff)
	
	wrappedRange: function(index, rangeMin, rangeMax) {
		
		// default values

		if(typeof rangeMin == 'undefined'){ rangeMin = 0; }

		//
		
		if(index >= rangeMin && index <= rangeMax){ return index; }
		
		if(index < rangeMin){ return index + (rangeMax + 1); }
		if(index > rangeMax){ return rangeMin + index - (rangeMax + 1); }
		
		return 0;			
	},

	// min max

	restrictBounds: function(value, minBound, maxBound){

		if(value < minBound){ return minBound; }
		else if(value > maxBound){ return maxBound; }

		return value;
	},

};