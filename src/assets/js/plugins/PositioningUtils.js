
if(typeof(Utils) === 'undefined' || !Utils){ Utils = {}; }

Utils.PositioningUtils = {
	
	// convert one offset to another

	localToLocal: function($originContainer, $destinationContainer, x, y){
		var originPos = this.localToGlobal($originContainer, x, y);
		return this.globalToLocal($destinationContainer, originPos.x, originPos.y);
	},

	// convert local offset to global

	localToGlobal: function($container, x, y){
		var globalOffset = $container.offset();
		return {x:x+globalOffset.left, y:y+globalOffset.top};
	},

	// convert global offset to local

	globalToLocal: function($container, x, y){
		var globalOffset = $container.offset();
		return {x:x-globalOffset.left, y:y-globalOffset.top};
	},

	// get element offset relative to given parent

	getPositionRelativeTo: function($child, $container){

		var childOffset = $child.offset();
		var containerOffset = $container.parent().length == 0 ? {top:0, left:0} : $container.offset();

		return {top: childOffset.top - containerOffset.top, left: childOffset.left - containerOffset.left};
	},

	// get full position or offset (including right & bottom)

	getExtendedPosition: function($el){

		var position = $el.position();
		position.right = position.left + $el.outerWidth();
		position.bottom = position.top + $el.outerHeight();
		position.width = position.right - position.left;
		position.height = position.bottom - position.top;
		position.centerX = position.left + Math.round(position.width/2);
		position.centerY = position.top + Math.round(position.height/2);

		return position;
	},

	getExtendedOffset: function($el){

		var offset = $el.offset();
		offset.right = offset.left + $el.outerWidth();
		offset.bottom = offset.top + $el.outerHeight();
		offset.width = offset.right - offset.left;
		offset.height = offset.bottom - offset.top;
		offset.centerX = offset.left + Math.round(offset.width/2);
		offset.centerY = offset.top + Math.round(offset.height/2);

		return offset;
	},

	// fit to the dimensions of another object -------------------------------------------------  /
	
	fitToObject: function($content, $container, contentRatio, centerX, centerY, fillObject, useOutsideDimensions) { 
				
		// defaults

		if(typeof(centerX) === 'number' && isNaN(centerX)){ centerX = 0.5; }
		else if(typeof(centerX) === 'boolean'){
			if(centerX == true){ centerX = 0.5; }
			else { centerX = 0; }
		}

		if(typeof(centerY) === 'number' && isNaN(centerY)){ centerY = 0.5; }
		else if(typeof(centerY) === 'boolean'){
			if(centerY == true){ centerY = 0.5; }
			else { centerY = 0; }
		}

		fillObject = (fillObject == true);
		useOutsideDimensions = (useOutsideDimensions == true);

		//

		if($content && $content.length > 0 && $container && $container.length > 0){

			var maxWidth = useOutsideDimensions ? $container.outerWidth() : $container.width();
			var maxHeight = useOutsideDimensions ? $container.outerHeight() : $container.height();

			sizeToFit($content, contentRatio, maxWidth, maxHeight, centerX, centerY, fillObject);
		}
		else { 
			console.log("ERROR: fitToObject: Invalid target. $content=", $content, "$container=", $container);
		}

	},
	
	// utility to fit into certain dimensions --------------------------------------------------  /
	
	sizeToFit: function($content, contentRatio, maxWidth, maxHeight, centerX, centerY, fillObject) {
		
		// defaults

		if(typeof(centerX) === 'number' && isNaN(centerX)){ centerX = 0.5; }
		else if(typeof(centerX) === 'boolean'){
			if(centerX == true){ centerX = 0.5; }
			else { centerX = 0; }
		}

		if(typeof(centerY) === 'number' && isNaN(centerY)){ centerY = 0.5; }
		else if(typeof(centerY) === 'boolean'){
			if(centerY == true){ centerY = 0.5; }
			else { centerY = 0; }
		}
		
		fillObject = (fillObject == true);

		//

		var contentWidth = parseInt($content.innerWidth());
		var contentHeight = parseInt($content.innerHeight());
		var idealRatio = maxWidth / maxHeight;

		var newWidth = 0;
		var newHeight = 0;

		if(fillObject){

			if(contentRatio > idealRatio){
				newHeight = maxHeight;
				newWidth = newHeight * contentRatio;
			}
			else {
				newWidth = maxWidth;
				newHeight = newWidth / contentRatio;
			}				
		}
		else {
			
			if(contentRatio > idealRatio){
				newWidth = maxWidth;
				newHeight = newWidth / contentRatio;
			}
			else {
				newHeight = maxHeight;
				newWidth = newHeight * contentRatio;
			}
		}

		newWidth = Math.round(newWidth);
		newHeight = Math.round(newHeight);

		// complete

		$content.css({width: newWidth, height: newHeight});

		// if centering, change margin, else don't touch margin values
		
		if(centerX){ 
			var newX = Math.round((maxWidth - newWidth) * centerX);
			$content.css({marginLeft:newX});
		}

		if(centerY){ 
			var newY = Math.round((maxHeight - newHeight) * centerY); 
			$content.css({marginTop:newY});
		}
	}

	// -----------------------------------------------------------------------------------------  /

};