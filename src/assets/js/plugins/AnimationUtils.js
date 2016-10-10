// animation assistance methods

if(typeof(Utils) === 'undefined' || !Utils){ Utils = {}; }

Utils.AnimationUtils = {

	onTransitionComplete: function($el, callback){
		$el.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', callback);
	},

	oneTransitionComplete: function($el, callback){
		$el.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', callback);
	},

	offTransitionComplete: function($el, callback){
		$el.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', callback);
	},

	makeMaskWrapper: function($target){

		var $maskWrapper = $('<div class="mask-wrapper"></div>');
		$maskWrapper.addClass('mask-wrapper');
		$maskWrapper.css({
			position: $target.css('position'),
			display: $target.css('display'),
			top: $target.css('top'),
			left: $target.css('left'),
			width: $target.css('width'),
			height: $target.css('height'),
			overflow: 'hidden',
		});

		$target.css({
			top: 0,
			left: 0,
			position: 'absolute',
			display: 'block',
		});

		$target.parent().append($maskWrapper);
		$target.remove();
		$maskWrapper.html($target);
	},

	splitTextPlus: function($target, options){

		// This adds line and word classes to each element, making it easier to detect the positioning of objects
		// without having to make a new SplitText().
		// If your text is looking weird, make sure the FONT IS LOADED FIRST!

		var defaults = {

			// double-wrap divs for masking or animation effects

			type: 'lines',

			doubleWrapLine: false,
			doubleWrapWord: false,
			doubleWrapChar: false,
		}

		var modifiedOptions = $.extend({}, options);

		for(var key in modifiedOptions){
			var val = (modifiedOptions[key] === 'undefined') ? null : modifiedOptions[key];
			if(val == undefined || val == null){ modifiedOptions[key] = defaults[key]; }
		}

		options = $.extend({}, defaults, modifiedOptions);

		//


		var split = new SplitText($target, {position:'absolute', type:options.type});

		var lineIndex = 0;
		var lineWordIndex = 0;
		var totalWordIndex = 0;

		if(split.lines && split.lines.length > 0){

			for(var i = 0; i<split.lines.length; i++){

				var $line = $(split.lines[i]);
				$line.addClass('line');

				if(options.doubleWrapLine){

					var $lineWrapper = $('<div class="line-wrapper"></div>');
					$lineWrapper.addClass('line-wrapper-' + i);
					$lineWrapper.css({
						position: 'absolute',
						top: $line.css('top'),
						left: $line.css('left'),
						width: $line.css('width'),
						height: $line.css('height'),
					});

					$line.css({
						top: 0,
						left: 0,
					});

					$line.parent().append($lineWrapper);
					$line.remove();
					$lineWrapper.html($line);
				}
			}
		}

		if(split.words && split.words.length > 0){

			var lastTop = $(split.words[0]).offset().top;

			for(var i = 0; i<split.words.length; i++){

				var $word = $(split.words[i]);
				var chars = $word.children();
				var top = $word.offset().top;

				if(top != lastTop){
					lastTop = top;
					lineWordIndex = 0;
					lineIndex ++;
				}

				var lineClass = 'line-' + lineIndex;
				var lineWordClass = 'line-word-' + lineWordIndex;
				var totalWordClass = 'total-word-' + i;

				$word.addClass('word');
				$word.addClass(lineClass);
				$word.addClass(lineWordClass);
				$word.addClass(totalWordClass);

				for(var k=0; k<chars.length; k++){

					var $char = $(chars[k]);

					$char.addClass('char');
					$char.addClass(lineClass);
					$char.addClass(lineWordClass);
					$char.addClass(totalWordClass);

					// double wrap

					if(options.doubleWrapChar){

						var $charWrapper = $('<div class="char-wrapper"></div>');
						$charWrapper.addClass('char-wrapper-' + i);
						$charWrapper.css({
							position: 'absolute',
							top: $char.css('top'),
							left: $char.css('left'),
							width: $char.css('width'),
							height: $char.css('height'),
						});

						$char.css({
							top: 0,
							left: 0,
						});

						$char.parent().append($charWrapper);
						$char.remove();
						$charWrapper.html($char);
					}
				}

				// double wrap

				if(options.doubleWrapWord){

					var $wordWrapper = $('<div class="word-wrapper"></div>');
					$wordWrapper.addClass('word-wrapper-' + i);
					$wordWrapper.css({
						position: 'absolute',
						top: $word.css('top'),
						left: $word.css('left'),
						width: $word.css('width'),
						height: $word.css('height'),
					});

					$word.css({
						top: 0,
						left: 0,
					});

					$word.parent().append($wordWrapper);
					$word.remove();
					$wordWrapper.html($word);
				}

				//

				lineWordIndex ++;
				totalWordIndex ++;
			}
		}

		return split;

	}
}
