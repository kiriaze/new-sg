
class ScrollAnimations {

	constructor(el, params){

		this.$el = $(el);
		this.params = params;

		this.skrollex;

		// initialize

		this.init();
	}

	init(){

		this.skrollex = new Skrollex({

			minWidth: 1024,
			staggerBefore: 0.04,
			staggerAfter: 0.04,

			onRender: function(e, params){

			},
			onPendingShow: function(e, params){

			},
			onPendingHide: function(e, params){

			},
			onViewportEnter: function(e, params){

				if ( e.$el.is('video') ) {
					e.$el[0].play();
				}

				var attr = e.$el.data('lazy-video');

				if ( typeof attr !== typeof undefined && attr !== false ) {
					e.$el.triggerHandler('play');
				}
			},
			onViewportLeave: function(e, params){

				if ( e.$el.is('video') ) {
					e.$el[0].pause();
				}

				var attr = e.$el.data('lazy-video');

				if ( typeof attr !== typeof undefined && attr !== false ) {
					e.$el.triggerHandler('pause');
				}
			},
			onShow: function(e, params){

				// fromTo's the first values occur instantly
				// to's: like rollovers, generally for modifying something that is already set

				var delay 	  = e.$el.data('delay') ? e.$el.data('delay') : 0, //.25,
					x         = e.$el.data('sk-direction-x') ? e.$el.data('sk-direction-x') : 12,
					y         = e.$el.data('sk-direction-y') ? e.$el.data('sk-direction-y') : 12;

				var opacity  = e.$el.data('sk-opacity') ? e.$el.data('sk-opacity') : 1;

				if(e.$el.data('sk-static'))
					return;

				if ( typeof ( e.$el.attr('data-animate-width' ) ) !== 'undefined' ){

					// clip it

					var elWidth			= e.$el.outerWidth();
					var elHeight		= e.$el.outerHeight();
					var clipObj			= "rect(0px " + (elWidth * 0.6) + "px " + elHeight + " 0px)";
					var clipCompleteObj	= "rect(0px " + (elWidth * 1) + " " + elHeight + " 0px)";

					TweenMax.fromTo(e.$el, 0.5, {
						opacity: 0
					}, {
						opacity: 1,
						delay: delay,
						ease: Cubic.easeOut
					});

					TweenMax.fromTo(e.$el, .32, {
						clip: clipObj,
						force3D: true
					}, {
						clip: clipCompleteObj,
						delay: delay,
						ease: Sine.easeOut
					});

					TweenMax.to(e.$el, 0.5, {clip:clipCompleteObj, delay:delay + 0.12, ease:Quint.easeOut});

				} else if ( typeof ( e.$el.attr('data-animate-height') ) !== 'undefined' ) {

					var elHeight = e.$el.outerHeight();

					TweenMax.fromTo(e.$el, .6, {
						height: elHeight * 0.8,
						force3D: true,
					}, {
						height: elHeight,
						opacity: 1,
						delay: delay,
						ease: Cubic.easeOut
					});

				} else if ( typeof ( e.$el.attr('data-animate-text') ) !== 'undefined' ) {

					// horizontal width mask
					TweenMax.fromTo(e.$el, 1, {
						force3D: true,
						x: x,
					}, {
						opacity: 1,
						delay: delay,
						x: 0,
						ease: Cubic.easeOut
					});

					// e.$el.addClass('in-view');

				} else if ( typeof ( e.$el.attr('data-sk-fade') ) !== 'undefined' ) {

					// fade

					TweenMax.fromTo(e.$el, 0.5, {
						opacity: 0
					}, {
						opacity: 1,
						delay: delay,
						ease: Cubic.easeOut
					});
				}

				else if ( typeof ( e.$el.data('animate') ) !== 'undefined' || e.$el.hasClass('callout')) {

					var duration = e.$el.data('sk-duration') ? e.$el.data('sk-duration') : 0.24;
					var delay = e.$el.data('delay') ? e.$el.data('delay') : 0;
					var opacity  = e.$el.data('sk-opacity') ? e.$el.data('sk-opacity') : 1;
					var scale  = e.$el.data('sk-scale');
					var positionY = e.$el.data('sk-direction-y');
					var positionX = e.$el.data('sk-direction-x');
					var fromTop = e.$el.data('sk-from-top');
					var fromBottom = e.$el.data('sk-from-bottom');
					var fromLeft = e.$el.data('sk-from-left');
					var fromRight = e.$el.data('sk-from-right');
					var mask = e.$el.data('sk-mask');
					var maskFromBottom = e.$el.data('sk-mask-from-bottom');
					var maskFromTop = e.$el.data('sk-mask-from-top');
					var noOpacity = e.$el.data('sk-no-opacity');
					var fullSize = e.$el.data('sk-fullsize');

					var maskFromLeft = e.$el.data('sk-mask-from-left');
					var maskFromRight = e.$el.data('sk-mask-from-right');

					var elWidth			= e.$el.outerWidth();
					var elHeight		= e.$el.outerHeight();

					var originalPosition = ""

					var maskFromWidth = elWidth;
					var maskFromHeight = elHeight;
					var maskFromX = 0;
					var maskFromY = 0;

					if(maskFromBottom !== undefined) {
						maskFromWidth = elWidth;
						maskFromHeight = elHeight;
						maskFromX = 0;
						maskFromY = maskFromHeight;

					} else if(maskFromTop !== undefined) {
						maskFromWidth = elWidth;
						maskFromHeight = 0;
						maskFromX = 0;
						maskFromY = 0;
					} else if(maskFromRight !== undefined) {
						maskFromWidth = elWidth;
						maskFromHeight = elHeight;
						maskFromX = elWidth/3;
						maskFromY = 0;
					} else if(maskFromLeft !== undefined) {
						maskFromWidth = 0;
						maskFromHeight = elHeight;
						maskFromX = 0;
						maskFromY = 0;
					}

					var clipObj			= "rect("+maskFromY+"px, " + maskFromWidth + "px, " + maskFromHeight + "px, "+maskFromX+"px)";
					var clipCompleteObj	= "rect(0px, " + elWidth + "px, " + elHeight + "px, 0px)";

					var fromState		= {

					}

					var toState = {
						"transition":"opacity 0.24s cubic-bezier(0.150, 0.410, 0.035, 0.985), transform "+duration+"s cubic-bezier(0.19, 1, 0.22, 1), clip "+duration+"s cubic-bezier(0.19, 1, 0.22, 1)",
						"transition-delay":delay+"s",
						"transform":"",
						opacity:opacity
					}

					fromState['transform'] = "";

					if ( fromTop !== undefined || fromBottom !== undefined || fromLeft !== undefined || fromRight !== undefined ) {

						var maskWrapper		= $("<div></div>");
						var maskWrapperCSS	= {}

						if ( fullSize !== undefined ) {
							maskWrapperCSS.width	= "100%";
							maskWrapperCSS.height	= "100%";
						} else {
							maskWrapperCSS.width	= elWidth;
							maskWrapperCSS.height	= elHeight;
						}

						maskWrapperCSS['overflow'] = "hidden";

						if ( e.$el.css("position") ) {
							maskWrapperCSS.position	= e.$el.css("position");
							maskWrapperCSS.top		= 0;
							maskWrapperCSS.left		= 0;
						}

						maskWrapper.css(maskWrapperCSS);
						e.$el.before(maskWrapper)
						maskWrapper.append(e.$el);

						if ( fromTop !== undefined ) {
							fromState['transform'] += " translate3d(0px,"+parseFloat(-40)+"px,0px)";
						}
						if ( fromBottom !== undefined ) {
							fromState['transform'] += " translate3d(0px,"+parseFloat(40)+"px,0px)";
						}

						if ( fromLeft !== undefined ) {
							fromState['transform'] += " translate3d("+parseFloat(-40)+"px,0px,0px)";
						}

						if ( fromRight !== undefined ) {
							fromState['transform'] += " translate3d("+parseFloat(40)+"px,0px,0px)";
						}

						toState['transform'] += " translate3d(0px,0px,0px)";
					}

					if ( mask !== undefined || maskFromBottom !== undefined || maskFromTop !== undefined || maskFromLeft !== undefined || maskFromRight !== undefined ) {

						var relativeWrapper		= $("<div></div>");
						var relativeWrapperCSS	= {}

						if ( fullSize !== undefined ) {
							relativeWrapperCSS.width = "100%";
							relativeWrapperCSS.height = "100%";
						} else {
							relativeWrapperCSS.width = elWidth;
							relativeWrapperCSS.height = elHeight;
						}

						if ( e.$el.css("position") ) {
							relativeWrapperCSS.position = e.$el.css("position");
							relativeWrapperCSS.top = 0;
							relativeWrapperCSS.left = 0;
							relativeWrapperCSS.overflow = 'hidden';
						}

						relativeWrapper.css(relativeWrapperCSS);
						e.$el.parent().prepend(relativeWrapper)
						relativeWrapper.append(e.$el);

						fromState['clip']		= clipObj;
						originalPosition		= e.$el.css("position");
						fromState['position']	= "absolute";
						fromState['object-fit']	= "cover";

						fromState['width']		= "100%"
						fromState['height']		= "100%"

						if ( fullSize === undefined ) {
							fromState['width']	= elWidth
							fromState['height']	= elHeight
						}

						if ( mask !== undefined ) {
							fromState['clip'] = clipCompleteObj;
						}

						toState['clip'] = clipCompleteObj;
					}

					if(opacity !== undefined) {
						fromState['opacity'] = 0;
						toState['opacity'] = opacity;
					}

					if(noOpacity !== undefined) {
						fromState.opacity = 1;
					}

					if ( positionY !== undefined || positionX !== undefined ) {

						var _x			= positionX !== undefined ? positionX : 0;
						var _y			= positionY !== undefined ? positionY : 0;
						var translate	= "translate3d("+_x+"px,"+_y+"px,0px)"

						fromState['transform'] += " "+translate;
						toState['transform'] += " translate3d(0,0,0)";
					}

					if ( scale !== undefined ) {
						fromState['transform'] += " scale("+parseFloat(scale)+")";
						toState['transform'] += " scale(1)";
					}

					if ( e.$el.hasClass("link") )
						console.log(fromState);

					e.$el.css(fromState)
					e.$el.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', onTransitionEnd)

					window.requestAnimationFrame(function(){
						e.$el.offset().top;
						e.$el.css(toState)
					})

				} else {

					var fromState = {

					}

					var toState = {
						"transition":"opacity 0.4s cubic-bezier(0.150, 0.410, 0.035, 0.985), transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)",
						"transition-delay":delay+"s",
						opacity:opacity
					}

					var translate			= "translate3d(0px,20px,0px)"
					fromState['transform']	= "translate3d(0px,20px,0px)"
					toState['transform']	= "translate3d(0,0,0)";

					e.$el.css(fromState)
					e.$el.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', onTransitionEnd)

					window.requestAnimationFrame(function(){
						e.$el.offset().top;
						e.$el.css(toState)
					})

				}

				function onTransitionEnd(k){

					e.$el.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', onTransitionEnd)
					e.$el.triggerHandler('skComplete');

					if ( originalPosition )
						e.$el.css("position","");

					if(relativeWrapper) {
						e.$el.insertBefore(relativeWrapper);
						relativeWrapper.css({
							"width":"100%",
							"height":"100%"
						});
						relativeWrapper.remove()
					}

					if(maskWrapper) {
						e.$el.insertBefore(maskWrapper);
						maskWrapper.css({
							"width":"100%",
							"height":"100%"
						});
						maskWrapper.remove()

						console.log("END")
					}

					setTimeout(function(){
						TweenMax.set(e.$el, {clearProps:'clip, x, y, scale, transition'});
					}, 0);
				}

			},
			onHide: function(e, params){

			},
			onRemove: function(e, params){

			}
		});
	}
}

module.exports = ScrollAnimations;
