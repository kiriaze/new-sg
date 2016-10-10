// requestAnimationFrame polyfill
var lastTime	= 0;
var vendors		= ['webkit', 'moz'];

for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
	window.requestAnimationFrame	= window[vendors[x]+'RequestAnimationFrame'];
	window.cancelAnimationFrame		=
		window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = function(callback, element) {
		var currTime	= new Date().getTime();
		var timeToCall	= Math.max(0, 16 - (currTime - lastTime));
		var id			= window.setTimeout(function() { callback(currTime + timeToCall); },
			timeToCall);
		lastTime        = currTime + timeToCall;
		return id;
	};
}

if ( !window.cancelAnimationFrame ) {
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}

let el = document.createElement('x-test');

let supportsBackgroundClipText = typeof el.style.BackgroundClip !== 'undefined' && (el.style.BackgroundClip = 'text', el.style.BackgroundClip === 'text');

let supportsWebkitBackgroundClipText = typeof el.style.webkitBackgroundClip !== 'undefined' && (el.style.webkitBackgroundClip = 'text', el.style.webkitBackgroundClip === 'text');

if(!supportsBackgroundClipText && !supportsWebkitBackgroundClipText) {
	$('body').addClass('no-background-clip-text');
}
