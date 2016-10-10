
if(typeof(Utils) === 'undefined' || !Utils){ Utils = {}; }

Utils.BrowserUtils = {

	// get vars from url params

	getUrlParameters: function(str) {
		if(!str) str = window.location.search;
		var returnObj = str.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = decodeURIComponent(n[1]),this}.bind({}))[0];

		for(var key in returnObj){
			if(returnObj[key] === 'undefined'){
				returnObj[key] = null;
			}
		}

		return returnObj;
	},

	//

	mergeURLParams: function(newString, oldString){
		
		var newObj = this.getUrlParameters(newString);
		var oldObj = this.getUrlParameters(oldString);
		var mergedObj = _.clone(oldObj);

		for(var key in newObj){
			mergedObj[key] = newObj[key];
		}

		for(var key in mergedObj){
			if(mergedObj[key] === 'undefined'){
				mergedObj[key] = null;
			}
		}

		return mergedObj;
	},

	// create url string from object

	param: function(obj){

		var mergedString = '';
		var i = 0;

		for(var key in obj){
			if(i > 0){ mergedString += '&'; }
			mergedString += String(key);
			if(obj[key]){
				mergedString += '=' + String(obj[key]);
				i++;
			}
		}

		return mergedString;
	},

	// ie detection ----------------------------------------------------------------------------  /

	isIE: function() { 
		
		// from http://stackoverflow.com/questions/17907445/how-to-detect-ie11

		return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null))); 
	},

	isOldIE: function(){

		if(!this.isIE()){ return false; }

		// from http://www.jquerybyexample.net/2014/06/how-to-detect-ie-11-using-javascript-jquery.html

		var sAgent = window.navigator.userAgent;
		var Idx = sAgent.indexOf("MSIE");
		var versionNumber = 0;

		// If IE, return version number.

		if (Idx > 0){
			// older versions user agent match
			versionNumber = parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
		}
		else if (!!navigator.userAgent.match(/Trident\/7\./)){
			// If IE 11 then look for Updated user agent string.
			versionNumber = 11;
		}

		return (versionNumber < 11);
	},

	isFF: function(){
		return navigator.userAgent.match(/firefox/i) !== null;
	},

	isSafari: function(){
		
		var uagent = navigator.userAgent.toLowerCase();
		if(/safari/.test(uagent) && !/chrome/.test(uagent)){ return true; }

		return false;
	},

	// mobile detection -----------------------------------------------------------  /

	isTouch: function(){
		return $('html').hasClass('touch');
	},

	isMobile: function(detectTablets, detectPhones){

		if(typeof(detectTablets) === 'undefined'){ detectTablets = false; }
		if(typeof(detectPhones) === 'undefined'){ detectPhones = true; }

		if(detectTablets && this.isTablet()) { return true; }
		if(detectPhones && this.isPhone()) { return true; }

		return false;
	},

	isDesktop: function(){
		return !this.isMobile(true, true);
	},

	isPhone: function(){
		if(/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) { return true; }
		return false;
	},

	isTablet: function(){
		if(/ipad|(android|chrome) ([.0-9]*)(.*)(mobile)/i.test(navigator.userAgent.toLowerCase())){ return true; }
		return false;
	},

	// force download --------------------------------------------------------------------------  /

	forceDownload: function(url) {

		var hiddenIFrameID = 'hiddenDownloader',
				iframe = document.getElementById(hiddenIFrameID);
		if (iframe === null) {
				iframe = document.createElement('iframe');
				iframe.id = hiddenIFrameID;
				iframe.style.display = 'none';
				document.body.appendChild(iframe);
		}
		iframe.src = url;
	}

	// -----------------------------------------------------------------------------------------  /
}

