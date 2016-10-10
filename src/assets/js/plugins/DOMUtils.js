
/* Utilities for DOM-related methods */

if(typeof(Utils) === 'undefined' || !Utils){ Utils = {}; }

Utils.DOMUtils = {

	docWidth: 0,
	docHeight: 0,

	breakSizes: null,

	// wait for object to change size (for example, text rendering) ----------------------------  /

	onSizeChange: function($element, callBack, context, maxIntervals, displayWarning){

		if(!maxIntervals){ maxIntervals = 50; }

		var intervals = 0;
		var warningLimit = 25;
		var limitHit = false;
		var complete = false;

		var initial = {
			width: $element.outerWidth(),
			height: $element.outerHeight(),
		};

		tick();

		function onTick(){

			intervals ++;
			limitHit = (intervals == maxIntervals);

			if($element.outerWidth() != initial.width || $element.outerHeight() != initial.height || limitHit){
				if(limitHit && displayWarning == true){ console.log("Warning: DOMUtils.onSizeChange limit reached. Giving up.", $element); }
				callBack.apply(context, [!limitHit]);				
				complete = true;
			}
			else if(intervals >= warningLimit){
				if(displayWarning == true){ console.log("Warning: DOMUtils.onSizeChange has hit", intervals, "for", $element); }
				warningLimit *= 10;
			}
		}

		function tick(){				
			
			onTick();
			
			window.requestAnimationFrame(function(){
				if(!complete){ tick(); }
			});
		}
	},

	// dom ready that actually works -----------------------------------------------------------  /

	onRender: function($element, callBack, context, maxIntervals, displayWarning){

		if(!maxIntervals){ maxIntervals = 50; }

		var intervals = 0;
		var warningLimit = 25;
		var limitHit = false;
		var complete = false;

		tick();

		function onTick(){

			intervals ++;
			limitHit = (intervals == maxIntervals);

			if($element.outerWidth() > 0 || $element.outerHeight() > 0 || limitHit){
				if(limitHit && displayWarning == true){ console.log("Warning: DOMUtils.onRender limit reached. Giving up.", $element); }
				callBack.apply(context, [!limitHit]);
				complete = true;
			}
			else if(intervals >= warningLimit){
				if(displayWarning == true){ console.log("Warning: DOMUtils.onRender has hit", intervals, "for", $element); }
				warningLimit *= 10;
			}
		}

		function tick(){				
			
			onTick();
			
			window.requestAnimationFrame(function(){
				if(!complete){ tick(); }
			});
		}
	},

	// wait one tick (have callback occur in next code loop) -----------------------------------   /

	wait: function(callBack, ticks, context){
		
		ticks = _.isNumber(ticks) ? ticks : 0;

		var count = 0;

		function tick(){

			window.requestAnimationFrame(function(){
				count ++;
				if(count >= ticks){ callBack.apply(context); }
				else { tick(); }
			});
		}
	},

	// set overflow for body based on size of window (removes chances of weird things happening)- /

	updateBodyOverflow: function(){
		
		var self = this;
		var winWidth = $(window).width();
		var winHeight = $(window).height();

		var minWidth = $('html').css('min-width') || $('body').css('min-width');
		if(minWidth){ minWidth = parseInt(minWidth); }

		var minHeight = $('html').css('min-height') || $('body').css('min-height');
		if(minHeight){ minHeight = parseInt(minHeight); }

		var overflow = (!minWidth || (minWidth && winWidth > minWidth)) && (!minHeight || (minHeight && winHeight > minHeight)) ? "hidden" : "auto";

		$('body').css({overflow:overflow});
	},

	// gets document width based on min-width and window width ---------------------------------  /

	getDocWidth: function(refresh){

		var self = this;

		if(!self.docWidth || refresh === true){ 
			if(!self.docWidth){ $(window).resize(onResize); }
			onResize(); 
		}

		return self.docWidth;

		// caches width value, updated via resize event.
		// use to avoid redundant $(window).resize() listeners
		// will also respect min-width and return values only >=

		function onResize(){

			var minWidth = parseInt($('html').css('min-width')) || parseInt($('body').css('min-width'));

			if(minWidth){
				
				var winWidth = window.innerWidth;

				if(winWidth > minWidth){ self.docWidth = winWidth; }
				else { self.docWidth = minWidth; }
			}
			else {
				self.docWidth = window.innerWidth;
			}
		}
	},

	// gets document height based on min-height and window height ----------------------------  /

	getDocHeight: function(refresh) {

		var self = this;

		if(!self.docHeight || refresh === true){ 
			if(!self.docHeight){ $(window).resize(onResize); }
			onResize(); 
		}

		return self.docHeight;

		// caches height value, updated via resize event.
		// use to avoid redundant $(window).resize() listeners
		// will also respect min-height and return values only >=

		function onResize(){

			var minHeight = parseInt($('html').css('min-height')) || parseInt($('body').css('min-height'));
			
			if(minHeight){
				
				var winHeight = window.innerHeight;

				if(winHeight > minHeight){ self.docHeight = winHeight; }
				else { self.docHeight = minHeight; }
			}
			else {
				self.docHeight = window.innerHeight;
			}
		}
	},

	// reverse natural z-index sorting for specified elements.
	// elements higher on the page will have higher z-index
	// elements lower on page will have lower z-index

	sortZIndexElements: function($container){

		var self = this;
		var $zIndexElements = $container.find('.descending-z-index');

		var sortedZIndexElements = $zIndexElements.sort(
			
			function(a, b){

				var $a = $(a);
				var $b = $(b);
				var aOffset = $a.offset();
				var bOffset = $b.offset();

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

		for(var i=0; i<sortedZIndexElements.length; i++){
			var $zIndexElement = $(sortedZIndexElements[i]);
			var zIndex = parseInt($zIndexElement.css('z-index')) || 0;
			$zIndexElement.css('z-index', zIndex+(i+1));
		}
	},

	// check media break points

	createMediaBreakPoints: function(sizes){

		if(!sizes){ sizes = [768,992,1200,1480]; }

		var self = this;

		// remove any old media breaks

		if(self.breakSizes){ 
			$('#media-breaks').remove();
			$('#media-breaks-styles').remove();
		}

		// create new media breaks markup

		self.breakSizes = sizes;

		var $breaks = $('<div id="media-breaks"></div>').appendTo($('head'));
		var $style = $('<style id="media-breaks-styles" type="text/css"></style>').appendTo($('head'));
		var styleText = '';

		for(var i=0; i<self.breakSizes.length; i++){
			
			var breakSize = self.breakSizes[i];
			var nextBreakSize = (i < self.breakSizes.length-1) ? self.breakSizes[i+1]-1 : -1;

			$breaks.append('<div class="break-' + breakSize + '"></div>');
			styleText += '#media-breaks .break-' + breakSize + ' { opacity:0; } \n';

			if(nextBreakSize > 0){ 
				styleText += '@media (min-width: ' + breakSize + 'px) and (max-width: ' + nextBreakSize + 'px){ #media-breaks .break-' + breakSize + ' { opacity:1; }} \n';
			}
			else {
				styleText += '@media (min-width: ' + breakSize + 'px){ #media-breaks .break-' + breakSize + ' { opacity:1; }} \n';
			}
		}

		$style[0].innerHTML = styleText;
	},

	isBreakPoint: function(size){

		var self = this;
		var $breakPoint = $('#media-breaks').find('.break-' + size);

		if(parseInt($breakPoint.css('opacity')) === 1){ return true; }
		return false;
	},

	isLessThanBreakPoint: function(size){

		// check current break point against size
		// returns true if break point is GREATER THAN (not inclusive) param

		var self = this;
		size = parseInt(size);

		if(isNaN(size)){ return false; }

		for(var i=0; i<self.breakSizes.length; i++){
			var breakSize = self.breakSizes[i];
			if(self.isBreakPoint(breakSize)){
				if(breakSize < size){ return true; }
				return false;
			}
		}

		return false;
	},

	isGreaterThanBreakPoint: function(size){

		var self = this;
		size = parseInt(size);

		if(isNaN(size)){ return false; }

		// check current break point against size
		// returns true if break point is LESS THAN (not inclusive) param

		for(var i=0; i<self.breakSizes.length; i++){
			var breakSize = self.breakSizes[i];
			if(self.isBreakPoint(breakSize)){
				if(breakSize > size){ return true; }
				return false;
			}
		}

		return false;
	},

	isBreakPointOrSmaller: function(size){

		// check current break point against size
		// returns true if break point is GREATER THAN (not inclusive) param

		var self = this;
		size = parseInt(size);

		if(isNaN(size)){ return false; }

		for(var i=0; i<self.breakSizes.length; i++){
			var breakSize = self.breakSizes[i];
			if(self.isBreakPoint(breakSize)){
				if(breakSize <= size){ return true; }
				return false;
			}
		}

		return false;
	},

	isBreakPointOrLarger: function(size){

		var self = this;
		size = parseInt(size);

		if(isNaN(size)){ return false; }

		// check current break point against size
		// returns true if break point is LESS THAN (not inclusive) param

		for(var i=0; i<self.breakSizes.length; i++){
			var breakSize = self.breakSizes[i];
			if(self.isBreakPoint(breakSize)){
				if(breakSize >= size){ return true; }
				return false;
			}
		}

		return false;
	},

	// -----------------------------------------------------------------------------------------  /

}