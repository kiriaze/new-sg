var LazyVideo = require("./lazy-video")

window.SETTINGS.addDomScanListener(function($scanContainer){

	window.SETTINGS.initElement($scanContainer, '[data-lazy-video]', function(){
		new LazyVideo(this);
	});

});
