var plyrHTML = require('./plyr-html')

class LazyVideo {
	constructor(domElement){

		function parseVideoURL(url) {

			function getParm(url, base) {

				var re		= new RegExp("(\\?|&)" + base + "\\=([^&]*)(&|$)");
				var matches	= url.match(re);

				if ( matches ) {
					return(matches[2]);
				} else {
					return("");
				}
			}

			var retVal = {};
			var matches;

			if ( url.indexOf('youtube.com/watch') != -1 ) {
				retVal.provider	= "youtube";
				retVal.id		= getParm(url, "v");
			} else if ( matches = url.match(/vimeo.com\/(\d+)/) ) {
				retVal.provider	= "vimeo";
				retVal.id		= matches[1];
			}

			return(retVal);

		}

		$(domElement).each(function() {

			var $this     	= $(this);
			var $videoThumb = $this.find('.video-thumb');
			var id        	= $this.data('video-id');
			var provider  	= $this.data('video-provider');
			var $playBtn    = $this.closest('.video-player').find('.play-btn');
			var src       	= '';
			var thumb_url 	= '';

			switch(provider) {

				case 'youtube':
				case 'yt':

					src			= '//www.youtube.com/embed/'+ id +'?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&controls=1&showinfo=0&rel=0&modestbranding=0';
					thumb_url	= '//i.ytimg.com/vi/' + id + '/hqdefault.jpg';

					if ( $videoThumb.length ){
						$this.find('.video-thumb').attr('src', thumb_url);
					}

					break;

				case 'vimeo':
				case 'plyr':
				case 'v':

					src		= '//player.vimeo.com/video/' + id + '?portrait=0&title=0&color=bf1f48&badge=0&byline=0&autoplay=1';

					var url	= 'http://www.vimeo.com/api/v2/video/' + id + '.json?callback=?';

					if ( $videoThumb.length ){

						$.getJSON( url, {
							format: 'json'
						}).done(function( data ) {
							thumb_url = data[0].thumbnail_large;
							$this.find('.video-thumb').attr('src', thumb_url);
						});
					}

					break;

				default:
					break;
			}

			$playBtn.on('click', function(e) {
				e.preventDefault();
				if ( provider === 'vimeo' ) {
					$this.data.plyr = plyr.setup($this.get(0), {
						autoplay: true,
						html: plyrHTML
					});
				}
				if ( Utils.BrowserUtils.isTablet() ) {
					$this.data.plyr = $('<iframe src="'+ src +'" frameborder="0" allowfullscreen></iframe>').css('background', 'none').appendTo($this);
				}
			});

			$this.on('pause', function(){
				// console.log('video player is paused');
				// if ( $this.data.plyr ) {
				// 	$this.data.plyr[0].pause();
				// }
			});

			$this.on('play', function(){
				// console.log('video player is playing');
				// if ( $this.data.plyr ) {
				// 	$this.data.plyr[0].play();
				// }
			});

		});
	}
}

module.exports = LazyVideo;
