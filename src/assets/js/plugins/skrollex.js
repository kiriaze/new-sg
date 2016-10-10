
/*

Modernizr Media Query detection:

https://modernizr.com/docs 

Modernizr.mq('(min-width: 900px)');

*

** Skrollex.js **

Features:

- Tracks scroll triggered elements on the page, fires events when visible.
- Allows 'scroll locking' to a specific zone (when using scrolling modals, for example).

---

Dependencies:

- jQuery
- Modernizr
- GSAP

---

Todo:

- Adjust delay based on vertical height of object.
- Allow for multiple scroll groups
- Make gutter distance based on scroll speed

---

Last update 07.27.16 by David Robbins

*/

;(function(window){

	'use strict';

	function Skrollex(options){

		// vars

		var self = this;
		var timer;

		self.options = options || {};
		self.defaults = {

			$el: null,							// if left empty will default to body
			$container: null,					// if left empty will default to window

			autoStart: true,					// automatically initialize event listeners and scroll checking
			disableOnTablet: true,				// do not initialize on tablet
			disableOnMobile: true,				// do not initialize on mobile

			// tweaks

			zSort: false,											// sort all elements on-screen with by z-index
			force3D: false,											// enable gpu acceleration for all elements (only recommended for opaque elements)
			staggerBefore: 0.06,									// delay before element is triggered (stacks in queue when grouped)
			staggerAfter: 0.06,										// delay applied to next element in queue
			staggerDownOnly: true,									// only stagger elements based on position when scrolling down
			hideOffscreen: false,									// hide elements off screen (will re-animate in, also can be performance boost)
			hideClass: 'invisible',									// class used to hide elements(invisible, opacity-0, display-none, hide)
			showClass: 'sk-showing',								// class signifying skrollex has triggered an 'onShow' event
			viewportEnterClass: 'sk-viewport-enter',				// class signifying skrollex has triggered an 'onShow' event
			minWidth: 768,											// minimum width for scroll hide/show, otherwise always visible
			showGutterTop: 0,										// pixels inside of screen for trigger events to happen
			showGutterBottom: 80,									// pixels inside of screen for trigger events to happen
			renderGutterTop: 0,										// pixels outside of screen for hide class to be added/removed
			renderGutterBottom: 0,									// pixels outside of screen for hide class to be added/removed

			// data attributes

			staggerId: 'skrollex',									// required attribute to be included to skrollex
			groupId: 'sk-group',									// required attribute for grouped timing

			// individual override data attributes
			// * indicates default if no value specified

			zSortId: 'sk-z-sort',									// override zSort (true*, false)
			force3DId: 'sk-force3d',								// override force3D (true*, false)
			staggerBeforeId: 'sk-stb',								// override staggerBefore (Number)
			staggerAfterId: 'sk-sta',								// override staggerAfter (Number)
			staggerDownOnlyId: 'sk-stagger-down',					// override staggerTime (Number)
			hideOffscreenId: 'sk-hide-offscreen',					// override hideOffscreen (true, false*)
			hideClassId: 'sk-hide-class',							// override hideClass (invisible*, opacity-0, display-none, hide)
			showClassId: 'sk-show-class',							// override showClass (String)
			viewportEnterClassId: 'sk-viewport-enter-class',		// override viewportEnterClass (String)
			minWidthId: 'sk-min-width',								// override minWidth (Number)
			showGutterTopId: 'sk-show-gutter-top',					// override showGutterTop (Number)
			showGutterBottomId: 'sk-show-gutter-bottom',			// override showGutterBottom (Number)
			renderGutterTopId: 'sk-render-gutter-top',				// override renderGutterTop (Number)
			renderGutterBottomId: 'sk-render-gutter-bottom',		// override renderGutterBottom (Number);

			// callbacks

			onRender: null,						// callback when element is triggered to render
			onViewportEnter: null,				// callback when element has entered the viewport
			onViewportLeave: null,				// callback when element has left the viewport
			onPendingShow: null,				// callback when element is waiting to appear
			onPendingHide: null,				// callback when element is waiting to disappear
			onShow: null,						// callback when element is triggered to appear
			onHide: null,						// callback when element is triggered to disappear
			onReset: null,						// callback when element is reset
			onRemove: null,						// callback when element is removed
		};

		//

		self.$el = null,
		self.$container = null;

		// scroll triggering

		self.lastGroupTriggerTime = 0;
		self.lastGroupTriggerDelay = 0;
		self.scrollTriggeredElements = [];
		self.scrollTriggersQueued = [];
		self.modules = [];

		// window vars

		self.winWidth = null;
		self.winHeight = null;
		self.scrollTop = null;
		self.lastScrollTop = null;

		//

		self.throttleTimer = null;
		self.isTicked = false;

		// init

		self._init();
	}

	//

	Skrollex.prototype = {

		_init: function(){

			var self = this;
			self.options = self._merge(self.options, self.defaults);

			if((self.options.disableOnMobile && self._isMobile(false, true)) || (self.options.disableOnTablet && self._isMobile(true, false))){
				
				$('html').addClass('skrollex-disabled');
			}
			else {

				// $('html').addClass('skrollex-enabled');
				$(function(){
					self._domReady();
				});
			}
		},

		update: function(){

			var self = this;
			self._scanDom();
		},

		// begin private methods ---------------------------------------------------------------  /

		_domReady: function(){

			var self = this;

			self.$el = self.options.$el = self._checkVal(self.options.$el, $('body'));
			self.$container = self.options.$container = self._checkVal(self.options.$container, $(window));

			self._addListeners();
			self._windowResize();
			self._scanDom();

			window.requestAnimationFrame(function(){
				self._scrollTick();
			});
		},

		// listeners ---------------------------------------------------------------------------  /

		_addListeners: function(){

			var self = this;

			var timer;

			self.$container.on('resize', $.proxy(this._onWindowResize, this));
			self.$container.on('scroll', $.proxy(this._onScroll, this));
			self.$container.mousewheel($.proxy(this._onMouseWheel, this));

			// global vent object listeners
			// create window.$vent if necessary

			if(typeof(window.$vent) === 'undefined'){ window.$vent = $('<div></div>'); }

			window.$vent.on('domUpdate', $.proxy(self._onDomUpdate, self));
		},

		_removeListeners: function(){

			var self = this;

			var timer;

			self.$container.off('resize', $.proxy(this._onWindowResize, this));
			self.$container.off('scroll', $.proxy(this._onScroll, this));
			self.$container.unmousewheel($.proxy(this._onMouseWheel, this));

			// global vent object listeners

			window.$vent.off('domUpdate', $.proxy(self._onDomUpdate, self));
		},

		// listener methods

		_onWindowResize: function(){

			var self = this;
			self._windowResize();
			self._scrollTick();
		},

		_onScroll: function(){

			var self = this;
			self._scrollTick();
		},

		_onMouseWheel: function(e, delta){

			var self = this;
			self._scrollTick();
		},

		// vent object listener methods

		_onDomUpdate: function(){

			var self = this;
			self._scanDom();
		},

		// scan dom for changes ----------------------------------------------------------------  /

		_scanDom: function(){

			var self = this;
			self._updateScrollTriggerElements();
			self._sortZIndexElements(self.$el);
		},

		// scroll triggered elements ----------------------------------------------------------------  /

		// dom elements w/ scroll-triggered class will be animated as they appear
		// animation options can be specified with data-scroll-animation-id attribute

		_updateScrollTriggerElements: function(){

			var self = this;
			var $scrollTriggeredElements = self.$el.find('[data-' + self.options.staggerId + ']');
			var $sortedTriggeredElements = self._sortDomElements($scrollTriggeredElements);

			// look for new scroll triggered elements that are not already tracked

			var foundElements = [];
			var newElements = [];

			for(var i=0; i<$sortedTriggeredElements.length; i++){

				var $scrollElement = $($sortedTriggeredElements[i]);
				var isFound = false;

				for(var k=0; k<self.scrollTriggeredElements.length; k++){

					var scrollTriggeredElement = self.scrollTriggeredElements[k];

					if(scrollTriggeredElement.$el[0] === $scrollElement[0]){

						if(foundElements.indexOf(scrollTriggeredElement) === -1){
							if(Modernizr.mq('(min-width:' + scrollTriggeredElement.minWidth + 'px)')){
								foundElements.push(scrollTriggeredElement);
							}
						}

						isFound = true;
						break;
					}
				}

				if(!isFound){

					var elementConfig = {

						$el: $scrollElement,
						$container: self.$el,

						// data vars options

						zSort: self._parseBool(self._checkVal($scrollElement.attr('data-' + self.options.zSortId), self.options.zSort, true)),
						force3D: self._parseBool(self._checkVal($scrollElement.attr('data-' + self.options.force3DId), self.options.force3D, true)),
						staggerBefore: parseFloat(self._checkVal($scrollElement.attr('data-' + self.options.staggerBeforeId), self.options.staggerBefore)),
						staggerAfter: parseFloat(self._checkVal($scrollElement.attr('data-' + self.options.staggerAfterId), self.options.staggerAfter)),
						staggerDownOnly: self._parseBool(self._checkVal($scrollElement.attr('data-' + self.options.staggerDownOnlyId), self.options.staggerDownOnly, true)),
						hideOffscreen: self._parseBool(self._checkVal($scrollElement.attr('data-' + self.options.hideOffscreenId), self.options.hideOffscreen, true)),
						hideClass: self._checkVal($scrollElement.attr('data-' + self.options.hideClassId), self.options.hideClass),
						showClass: self._checkVal($scrollElement.attr('data-' + self.options.showClassId), self.options.showClass),
						viewportEnterClass: self._checkVal($scrollElement.attr('data-' + self.options.viewportEnterClassId), self.options.viewportEnterClass),
						minWidth: self._checkVal($scrollElement.attr('data-' + self.options.minWidthId), self.options.minWidth),
						showGutterTop: self._checkVal($scrollElement.attr('data-' + self.options.showGutterTopId), self.options.showGutterTop),
						showGutterBottom: self._checkVal($scrollElement.attr('data-' + self.options.showGutterBottomId), self.options.showGutterBottom),
						renderGutterTop: self._checkVal($scrollElement.attr('data-' + self.options.renderGutterTopId), self.options.renderGutterTop),
						renderGutterBottom: self._checkVal($scrollElement.attr('data-' + self.options.renderGutterBottomId), self.options.renderGutterBottom),

						// default variables

						isEnabled: true,
						isTriggered: false,
						isPendingTrigger: false,
						isInitialConfig: true,
						isInViewport: false,
						isRendered: false,
						isShowing: false,
						isOut: true,

						// display delay timer

						delayedCall: null,

						//

						sk: self
					};

					if(Modernizr.mq('(min-width:' + elementConfig.minWidth + 'px)')){
						$scrollElement.data('skrollex', elementConfig);
						newElements.push(elementConfig);
					}
				}
			}

			// find what's not on screen and remove/destroy

			var removedElements = self._difference(self.scrollTriggeredElements, foundElements);

			self._each(removedElements, function(scrollElement, i){
				self.removeElement(scrollElement);
			});

			// combine new and existing

			self.scrollTriggeredElements = self._union(newElements, foundElements);

			if(self._isDesktop()){

				self._each(self.scrollTriggeredElements, function(scrollElement){
					self._tickElement(scrollElement);
				});
			}
			else {

				self._each(self.scrollTriggeredElements, function(scrollElement){
					self.showElement(scrollElement);
				});
			}
		},

		// remove all elements

		_removeScrollTriggerElements: function(){

			var self = this;

			self._each(self.scrollTriggeredElements, function(scrollElement){
				self.removeElement(scrollElement);
			});

			self.scrollTriggeredElements = [];
		},

		// tick element

		_tickElement: function(scrollElement){

			var self = this;

			if(self._isDesktop()){

				if(self.$el){

					var elOffset = scrollElement.$el.offset();

					if(elOffset && self.scrollTop !== null){

						var elPos = {x:elOffset.left, y:elOffset.top - self.scrollTop};
						var elHeight = scrollElement.$el.outerHeight(true);

						var elTop = elPos.y;
						var elBottom = elTop + elHeight;

						var showRegionTop = 0 + scrollElement.showGutterTop;
						var showRegionBottom = self.winHeight - scrollElement.showGutterBottom;

						var renderRegionTop = 0 - scrollElement.renderGutterTop;
						var renderRegionBottom = self.winHeight + scrollElement.renderGutterBottom;

						// set rendering mode if need be

						if(scrollElement.isInitialConfig){

							if(scrollElement.gpuAccelerate){
								TweenMax.set(scrollElement.$el, {force3D:true});
							}

							scrollElement.isInitialConfig = false;
						}

						// trigger direction

						var scrollDirection;

						if(self.lastScrollTop < self.scrollTop){ scrollDirection = 'down'; }
						else if(self.lastScrollTop > self.scrollTop){ scrollDirection = 'up'; }
						else { scrollDirection = 'none'; }

						// check if on screen at all
						// render if within render gutter

						if(elBottom >= renderRegionTop && elTop <= renderRegionBottom){

							// fire event - element is in viewport

							if(!scrollElement.isInViewport){
								self._triggerElementEnterViewport(scrollElement, { direction: scrollDirection });
							}

							// render element

							if(scrollElement.isOut !== false && scrollElement.isTriggered && !scrollElement.isPendingTrigger){
								self.renderElement(scrollElement);
							}
						}

						// check for triggers

						if((elBottom >= showRegionTop || self.scrollTop <= showRegionTop) && elTop <= showRegionBottom){

							// within show region - show element

							if(!scrollElement.isPendingTrigger && !scrollElement.isTriggered){
								self._triggerElementShow(scrollElement, { direction: scrollDirection });
							}
						}
						else if(elTop >= renderRegionBottom || elBottom <= renderRegionTop) {

							// fire event - element has left viewport

							if(scrollElement.isInViewport){
								self._triggerElementLeaveViewport(scrollElement, { direction: scrollDirection });
							}

							// outside show region - hide element

							if(scrollElement.hideOffscreen || !scrollElement.animateOnce){

								var exitDirection;

								if(elBottom <= renderRegionTop){ exitDirection = 'top'; }
								else if(elTop >= renderRegionBottom){ exitDirection = 'bottom'; }

								if(exitDirection && (scrollElement.isTriggered || scrollElement.isPendingTrigger)){

									if(scrollElement.hideOffscreen){
										self._triggerElementHide(scrollElement, { direction: scrollDirection, exitDirection: exitDirection });
									}
								}
							}
						}
					}
					else {
						self._scrollTick();
					}
				}

			} else {
				self.showElement(scrollElement);
			}
		},

		_triggerElementEnterViewport: function(scrollElement, params){

			var self = this;

			if(!scrollElement.isInViewport){

				scrollElement.isInViewport = true;

				if($.isFunction(self.options.onViewportEnter)){
					self.options.onViewportEnter.apply(null, [scrollElement, params]);
				}

				scrollElement.$el.addClass(scrollElement.viewportEnterClass);
				scrollElement.$el.triggerHandler('viewportEnter', self._extend({}, params));
			}
		},

		_triggerElementLeaveViewport: function(scrollElement, params){

			var self = this;

			if(scrollElement.isInViewport){

				scrollElement.isInViewport = false;

				if($.isFunction(self.options.onViewportLeave)){
					self.options.onViewportLeave.apply(null, [scrollElement, params]);
				}

				scrollElement.$el.removeClass(scrollElement.viewportEnterClass);
				scrollElement.$el.triggerHandler('viewportLeave', self._extend({}, params));
			}
		},

		_triggerElementShow: function(scrollElement, params){

			var self = this;

			if(!scrollElement.isTriggered){

				scrollElement.isTriggered = true;
				scrollElement.isPendingTrigger = true;

				// trigger pending show

				if($.isFunction(self.options.onPendingShow)){
					self.options.onPendingShow.apply(null, [scrollElement, params]);
				}

				scrollElement.$el.triggerHandler('pendingShow', self._extend({}, params));

				// determine if showing will also include a grouping delay

				if(self._isDesktop()){

					var $el = scrollElement.$el;
					var useStaggerGroup = (typeof($el.data(self.options.groupId)) !== 'undefined');

					if(useStaggerGroup && (params.direction === 'up' && self.options.staggerDownOnly)){
						useStaggerGroup = false;
					}

					// check if timing needs to be queued with other newly visible elements

					if(useStaggerGroup){

						self.scrollTriggersQueued.push({
							scrollElement: scrollElement,
							params: params
						});

						// check to make sure queued elements aren't being delayed by elements above the fold

						self._updateDelayQueue();
					}
					else {
						self.showElement(scrollElement, self._extend({instant:false}, params));
					}
				}
				else {
					self.showElement(scrollElement, self._extend({instant:true}, params));
				}
			}
		},

		_triggerElementHide: function(scrollElement, params){

			var self = this;

			if(scrollElement.isTriggered){

				scrollElement.isTriggered = false;
				scrollElement.isPendingTrigger = false;

				// trigger pending hide

				if($.isFunction(self.options.onPendingHide)){
					self.options.onPendingHide.apply(null, [scrollElement, params]);
				}

				scrollElement.$el.triggerHandler('pendingHide', self._extend({}, params));

				//

				if(scrollElement.delayedCall){ scrollElement.delayedCall.kill(); }
				self.hideElement(scrollElement, params);
			}
		},

		// change element state ----------------------------------------------------------------  /

		renderElement: function(scrollElement, params){

			var self = this;

			if(!scrollElement.isRendered){

				scrollElement.isRendered = true;
				scrollElement.$el.triggerHandler('render', params);

				if($.isFunction(self.options.onRender)){
					self.options.onRender.apply(null, [scrollElement, params]);
				}
			}
		},

		showElement: function(scrollElement, params){

			var self = this;

			if(!scrollElement.isRendered){ self.renderElement(scrollElement, params); }
			if(scrollElement.isOut){

				scrollElement.isOut = false;
				scrollElement.isShowing = true;
				scrollElement.$el.removeClass(scrollElement.hideClass);
				scrollElement.$el.addClass(scrollElement.showClass);
				scrollElement.$el.triggerHandler('show', params);

				if($.isFunction(self.options.onShow)){
					self.options.onShow.apply(null, [scrollElement, params]);
				}
			}
		},

		hideElement: function(scrollElement, params){

			var self = this;

			if(!scrollElement.isOut){

				scrollElement.isOut = true;
				scrollElement.isShowing = false;
				scrollElement.isPendingTrigger = false;

				scrollElement.$el.addClass(scrollElement.hideClass);
				scrollElement.$el.removeClass(scrollElement.showClass);
				scrollElement.$el.triggerHandler('hide', params);

				if($.isFunction(self.options.onHide)){
					self.options.onHide.apply(null, [scrollElement, params]);
				}
			}
		},

		resetElement: function(scrollElement, params){

			var self = this;

			scrollElement.$el.triggerHandler('reset', params);

			if($.isFunction(self.options.onReset)){
				self.options.onReset.apply(null, [scrollElement, params]);
			}
		},

		removeElement: function(scrollElement){

			var self = this;

			if(scrollElement.isRendered){

				scrollElement.isRendered = false;
				scrollElement.isOut = true;
				scrollElement.isPendingTrigger = false;

				if(scrollElement.delayedCall){ scrollElement.delayedCall.kill(); }
				scrollElement.$el.triggerHandler('remove');

				if($.isFunction(self.options.onRemove)){
					self.options.onRemove.apply(null, [scrollElement]);
				}
			}
		},

		// queued items display timing ---------------------------------------------------------  /

		_getScrollTriggerDelay: function(scrollElement){

			var self = this;
			var pos = 0;
			var d = 0;

			for(var i=0; i<self.scrollTriggersQueued.length; i++){
				var queuedElement = self.scrollTriggersQueued[i].scrollElement;
				if(queuedElement === scrollElement){
					d += queuedElement.staggerBefore;
					break;
				}
				else {
					d += queuedElement.staggerBefore + queuedElement.staggerAfter;
				}
			}

			return d;
		},

		_getQueuedElementIndex: function(scrollElement){

			var self = this;
			var pos = -1;

			for(var i=0; i<self.scrollTriggersQueued.length; i++){
				if(self.scrollTriggersQueued[i].scrollElement === scrollElement){
					pos = i;
					break;
				}
			}

			return pos;
		},

		_updateDelayQueue: function(){

			var self = this;
			var optimizedQueue = [];
			var d = 0;

			// trim display queue based on whether elements have been scrolled offscreen

			for(var i=0; i<self.scrollTriggersQueued.length; i++){

				var queuedTrigger = self.scrollTriggersQueued[i];
				var queuedElement = queuedTrigger.scrollElement;
				var queuedParams = queuedTrigger.params;

				var $queuedEl = queuedElement.$el;
				var topDistance = $queuedEl.offset().top - self.$container.scrollTop();
				var isValid = !(!$queuedEl.is(':visible') || topDistance < 0);

				d = !isValid ? queuedElement.staggerBefore : self._getScrollTriggerDelay(queuedElement);

				// only items with actual delays remain in queue

				if(isValid){ optimizedQueue.push(queuedTrigger); }
				queuedParams.delay = d;

				// prep delayed calls for when each element should display

				if(queuedElement.delayedCall){ queuedElement.delayedCall.kill(); }
				queuedElement.delayedCall = TweenMax.delayedCall(d, self._onQueuedElementTriggered.bind(self, queuedTrigger));
			}

			self.scrollTriggersQueued = optimizedQueue;

			//

			self.lastGroupTriggerTime = (new Date()).getTime();
			self.lastGroupTriggerDelay = d;
		},

		_onQueuedElementTriggered: function(queuedTrigger){

			var self = this;
			var queuedElement = queuedTrigger.scrollElement;

			self.scrollTriggersQueued.splice(self._getQueuedElementIndex(queuedElement), 1);

			self.showElement(queuedElement, self._extend({instant:false}, self._extend({}, queuedElement.params)));
		},

		// scroll position checking loop -----------------------------------------------------------  /

		_scrollTick: function(){

			var self = this;
			self.lastScrollTop = self.scrollTop;
			self.scrollTop = self.$container.scrollTop();

			if(!self.lastScrollTop){ self.lastScrollTop = self.scrollTop; }

			// trying throttling using timeout instead of every animation frame

			if (!self.throttleTimer){

				self._isTicked = false;

				self.throttleTimer = window.setTimeout(function() {
					window.clearTimeout(self.throttleTimer);
					self.throttleTimer = null;
					self._isTicked = true;
					self._tick();
				}, 20);
			}
		},

		//

		_tick: function(force){

			var self = this;

			if(self._isDesktop() && (self._isTicked || force === true)){

				self._isTicked = true;
				self._isPendingDelay = false;

				for(var i=0; i<self.scrollTriggeredElements.length; i++){
					self._tickElement(self.scrollTriggeredElements[i]);
				}
			}
		},

		// window listeners ------------------------------------------------------------------------  /

		_windowResize: function(e){

			var self = this;
			self.winWidth = window.innerWidth;
			self.winHeight = window.innerHeight;

			self._each(self.scrollTriggeredElements, function(scrollElement, i){
				self._tickElement(scrollElement);
			});
		},

		// destroy ---------------------------------------------------------------------------------  /

		destroy: function(e){

			var self = this;
			self._removeListeners();
			self._removeScrollTriggerElements();
		},

		// utils -----------------------------------------------------------------------------------  /

		_sortDomElements: function(elements){

			// sort elements by display order, top first, then left to right and down

			var sortedElements = elements.sort(

				function(a, b){

					var $a = $(a);
					var $b = $(b);
					var aOffset = $a.offset();
					var bOffset = $b.offset();

					if(aOffset.top < bOffset.top){
						return -1;
					}
					else if(aOffset.top == bOffset.top){

						if(aOffset.left < bOffset.left){ return -1; }
						else if(aOffset.left == bOffset.left){ return 0; }
						else { return 1; }
					}

					return 1;
				}
			);

			return sortedElements;
		},

		_sortZIndexElements: function($container){

			// assure that elements higher and further to the left have higher z-index than lower and rightward objects

			var self = this;
			var $zIndexElements = self.options.zSort ? $container.find('[data-' + self.options.staggerId + ']') : $container.find('[data-' + self.options.zSortId + ']');
			var maxZIndex = 0;

			$zIndexElements = this._sortDomElements($zIndexElements);

			for(var i=0; i<$zIndexElements.length; i++){
				var $zIndexElement = $($zIndexElements[i]);
				zIndex = parseInt($zIndexElement.css('z-index')) || 0;
				if(zIndex > maxZIndex){ maxZIndex = zIndex; }
			}

			for(var i=0; i<$zIndexElements.length; i++){
				var $zIndexElement = $($zIndexElements[i]);
				var zIndex = maxZIndex+(i+1);
				$zIndexElement.css('z-index', zIndex);
			}
		},

		_checkVal: function(val, fallbackVal, emptyVal){

			if(typeof(val) !== 'undefined'){
				if(val === '' && typeof(emptyVal) !== undefined){ return emptyVal; }
				else if(val !== null && !(typeof(val) === 'number' && isNaN(val))){ return val; }
			}

			return fallbackVal;
		},

		_parseBool: function(val){
			return (String(val).toLowerCase() === 'true');
		},

		_merge: function(options, defaults){

			var merged = $.extend({}, defaults);

			for(var key in options){

				var val = options[key];

				if(typeof(val) !== 'undefined' && val !== null && !(typeof(val) === 'number' && isNaN(val))){
					merged[key] = val;
				}
			}

			return merged;
		},

		_extend: function(obj, extending){

			var self = this;
			return self._merge(extending, obj);
		},

		_each: function(array, callback){

			for(var key in array){
				callback.apply(null, [array[key]]);
			}
		},

		_difference: function(array1, array2){

			var diff = [];

			for(var i=0; i<array1.length; i++){

				var obj1 = array1[i];
				if(array2.indexOf(obj1) === -1){
					diff.push(obj1);
				}
			}

			return diff;
		},

		_union: function(array1, array2){

			var self = this;
			var union = [];

			for(var i=0; i<array1.length; i++){

				var obj = array1[i];
				if(union.indexOf(obj) === -1){
					union.push(obj);
				}
			}

			for(var i=0; i<array2.length; i++){

				var obj = array2[i];
				if(union.indexOf(obj) === -1){
					union.push(obj);
				}
			}

			return union;
		},

		_isMobile: function(detectTablets, detectPhones){

			if(typeof(detectTablets) === 'undefined'){ detectTablets = false; }
			if(typeof(detectPhones) === 'undefined'){ detectPhones = true; }

			function isPhone(){
				if(/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) { return true; }
				return false;
			}

			function isTablet(){
				if(/ipad|(android|chrome) ([.0-9]*)(.*)(mobile)/i.test(navigator.userAgent.toLowerCase())){ return true; }
				return false;
			}

			//

			if(detectTablets && isTablet()) { return true; }
			if(detectPhones && isPhone()) { return true; }

			return false;
		},

		_isDesktop: function(){
			return !this._isMobile(true, true);
		}

		// -----------------------------------------------------------------------------------------  /

	};

	window.Skrollex = Skrollex;

})(window);