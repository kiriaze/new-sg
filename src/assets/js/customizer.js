var Cookies			= require('./customizer/js/js-cookie.js');
var menuAim			= require('./customizer/js/jquery.menu-aim.min.js');
var MediumEditor	= require('./customizer/js/medium-editor.js');
require('./customizer/js/jquery-ui-1.10.3.custom.min.js');
require('./customizer/js/jquery.ui.touch-punch.min.js');




/////////////////////////////////////////
//
// This is getting a major makeover guys
// so brace yourselves cuz this shit's
// about to get schwifty - ck
//
/////////////////////////////////////////


(function($){

	/* jshint devel:true */
	'use strict';

	window.STYLEGUIDE = {};

	var CCK = window.STYLEGUIDE;

	var $window      = $(window),
		$body        = $(document.body),
		$html        = $(document.documentElement);

	CCK.init = function(){

		CCK.setElements();
		CCK.basics();
		CCK.customizer();

	};

	CCK.setElements = function(){
		CCK.elems                   = {};

		// defaults
		CCK.elems.html              = $('html');
		CCK.elems.body              = $('body');

	};

	CCK.basics = function() {

		$('body').addClass('loaded');

	};

	// force download file
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	// file reader
	// drop/click to swap figures or images
	function readURL(input, elem) {
		if ( input.files && input.files[0] ) {
			var reader = new FileReader();

			reader.onload = function (e) {
				if ( elem.is('figure') ) {
					elem.css('background-image', 'url(' + e.target.result + ')');
				}
				if ( elem.is('img') ) {
					elem.attr('src', e.target.result);
				}
			}

			reader.readAsDataURL(input.files[0]);
		}
	}

	// medium editor - .editor classes become contenteditable
	function contentEditable() {

		// basic medium style editor
		var editor = new MediumEditor('[editable]', {
			buttonLabels: 'fontawesome',
			imageDragging: false, // disable built in image dragging
			toolbar: {
				buttons: [
					'bold',
					'italic',
					'quote',
					'image',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				],
			},
			placeholder: {
				text: 'Click to edit'
			}
		});

		// // on click of edit cta, disable/enable editing
		// $('.editable-toggle').on('click', function(e){
		// 	if ( ! CCK.elems.body.hasClass('editor-disabled') ) {
		// 		CCK.elems.body.addClass('editor-disabled');
		// 		editor.destroy();
		// 	} else {
		// 		CCK.elems.body.removeClass('editor-disabled');
		// 		editor.setup();
		// 	}
		// });

	}

	CCK.customizer = function(){

		// expected dir structure for referencing the images
		// ../assets/images/customizer/components/{size}/{name}/

		// extend for draggable
		var oldMouseStart = $.ui.draggable.prototype._mouseStart;
		$.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
			this._trigger("beforeStart", event, this._uiHash());
			oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
		};

		// customizer cookies nom nom nom
		if ( ( Cookies.get('toggle') == 'preview' ) || ( ! Cookies.get('toggle') ) ) {
			$('body').addClass('preview');
		}
		// customizer cookies nom nom nom

		// Modules
		var blocks,
			url           = '../assets/data/' + bodyClass + '-customizer.json',
			maxBlocks     = 40, // limit max number of mods on page
			thumbnailSize = '270',
			blockSize     = '1700';

		// get page mods
		$.getJSON( url, {
			format: 'json'
		}).done(function( data ) {
			blocks = data.blocks;
			cckInit();
		});

		function cckModMenu(){

			var modMenu = [];

			blocks.forEach(function(elem){
				modMenu.push('<li data-menu-item="'+ elem.type +'">'+ elem.name +'</li>');
			});

			$('#cck-mod-menu').append(modMenu);
		}

		// Add Sample by String
		function addSample(string){

			if ( ! string ) {

				var params		= $.getUrlVars(),
					structure	= params.structure;

			}

			if ( structure ){

				var parts = structure.split(',').slice(0, maxBlocks);

				parts.forEach(function(block){

					var types = block.split(':');

					if ( $.isArray(types) ){

						var id = types[0];

						if ( blocks[id] !== undefined ) {

							var name	= blocks[id].type,
								number	= types[1];

							if ( $.isNumeric(number, name) ) {

								var content = [
									'<li data-id="'+ id +'" data-name="'+ name +'" data-number="'+ number +'">',
										'<span class="cck-mod-name">'+ name +' #'+ number +'</span>',
										'<img  class="cck-mod-thumb" src="../assets/images/customizer/components/'+ pageName + '/' + blockSize +'/'+ name +'-'+ number +'.jpg">',
									'</li>'
								].join(' ');

								$('#cck-blocks').removeClass('empty').append(content);
							}
						}
					}
				});
			}

			$('#sortable').sortable('refresh');
			checkBlocksHeight();
			updateHash();
		}

		// Update
		function updateHash(){

			var urlParts = []

			// get structure
			var blocks = [];

			$.map($('#cck-blocks').children('li'), function(el){
				blocks.push( $(el).data('id') + ':' + $(el).data('number') );
			});

			if ( blocks.length > 0 ) {
				var hashURL = "structure=" + blocks.join(',');
			}

			if ( hashURL ) {

				urlParts.push(hashURL);

				window.location.hash = urlParts.join('&');

			} else {
				window.location.hash = "";
			}
		}

		// Change Size of Blocks Holder
		function checkBlocksHeight(){
			if ( $('#cck-blocks li').length ){
				$('#cck-blocks').removeClass('empty');
				$('#cck-blocks-holder').removeClass('cck-hide-ui');
				$('.footer').addClass('cck-hidden');
			} else {
				$('#cck-blocks').addClass('empty');
				$('#cck-blocks-holder').addClass('cck-hide-ui');
				$('.footer').removeClass('cck-hidden');
			}
		}

		// Max Size
		function checkMaxSize(){
			if ( $('#cck-blocks > li:not(.placeholder)').size() < maxBlocks ) {
				$('#cck-side-menu').removeClass('disabled');
			} else {
				$('#cck-side-menu').addClass('disabled');
			}
		}

		// Modals
		function customizerModals(elem) {

			$.magnificPopup.open({
				items: {
					src: elem,
				},
				type: 'inline',
				overflowY: 'scroll', // as we know that popup content is tall we set scroll overflow by default to avoid jump, mostly in cases of modals in short windows cutting off the close btn if placed outside the modal
				removalDelay: 500, //delay removal by X to allow out-animation
				callbacks: {
					beforeOpen: function(e) {
						this.st.mainClass = 'mfp-fade-in-up';
					}
				},
				midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
			});

			$(elem).find('[close-modal]').on('click', function(e){
				$.magnificPopup.close();
			});

		}

		// render markup
		function preview(){

			// reinit js
			window.requestAnimationFrame(function(){
				window.$vent.triggerHandler('domUpdate');
				window.$vent.triggerHandler('windowResize', {originalEvent:e});
			});

			if ( $('body').hasClass('preview') ) {

				// find all mods on page and clone them to the li if they dont yet exist,
				// if they do exist, show them
				// hide the span and img and disable the drag/drop
				$('#cck-blocks').children('li').each(function(index){

					var $this   = $(this),
						modNum  = $this.data('number'),
						modName = $this.data('name');

					$('.cck-mod-name, .cck-mod-thumb').hide();

					if ( ! $this.find('[data-number="'+ modNum +'"][data-name="'+ modName +'"]').length ) {
						$('#main').find('[data-number='+ modNum +'][data-name="'+ modName +'"]').clone().appendTo($this);
						contentEditable();
					} else {
						$this.find('[data-number="'+ modNum +'"][data-name="'+ modName +'"]').show();
					}

				});

				// add in header
				if ( ! $('.cck-browser').find('#header').length ) {
					$('#main').find('#header').prependTo('.cck-browser');
					$('#main').find('#mobile-header').prependTo('.cck-browser');
					$('#main').find('.shopping-cart').prependTo('.cck-browser');
					$('#main').find('.overlay--regions').prependTo('.cck-browser');
				} else {
					$('.cck-browser').find('#header').show();
					$('.cck-browser').find('#mobile-header').show();
				}

				//  add in footer
				if ( ! $('.cck-browser').find('#footer').length ) {
					$('#main').find('#footer').appendTo('.cck-browser');
				} else {
					$('.cck-browser').find('#footer').show();
				}

				// disable dragging
				$('#cck-blocks').sortable('disable');


				///////////////////
				// Figures
				///////////////////

				// wrap editable figures in file form input wrappers
				if ( ! $('figure[editable]').parents('.cck-image-swap.is-figure').length ) {
					$('figure[editable]').wrap('<form class="cck-image-swap is-figure"></form>');
					$('<input type="file" class="cck-input-file" />').appendTo('.cck-image-swap.is-figure');
				}

				// run file input swap on figures
				$('.cck-image-swap.is-figure .cck-input-file').change(function(){
					readURL(this, $(this).parents('.cck-image-swap').find('figure[editable]'));
				});

				///////////////////
				// Images
				///////////////////

				// wrap editable img tags in file form input wrappers
				if ( ! $('img[editable]').parents('.cck-image-swap.is-img').length ) {
					$('img[editable]').wrap('<form class="cck-image-swap is-img"></form>');
					$('<input type="file" class="cck-input-file" />').appendTo('.cck-image-swap.is-img');
				}

				// run file input swap on figures
				$('.cck-image-swap.is-img .cck-input-file').change(function(){
					readURL(this, $(this).parents('.cck-image-swap').find('img[editable]'));
				});

				///////////////////
				// Videos
				///////////////////

				// append a hoverable span placeholder for video tags since pseudos wont work
				$('video[editable]').each(function(index){
					var $this = $(this);
					if ( ! $this.parent().find('.cck-placeholder').length )
						$this.after('<span class="cck-placeholder">'+ $this.data('placeholder') +'</span>');
				});

				// swap out video src
				$('video[editable]').on('click', function(e){

					var video = $(this).get(0);

					$(this).css({
						'object-fit': 'cover'
					});

					customizerModals('#customizer--video');

					$('#customizer--video .btn').on('click', function(e){
						$.magnificPopup.close();
						video.src = $('#customizer--video').find('input').val();
						video.play();
					});
					// assets/video/cat-hero.mp4
				});

			} else {

				// on click again,
				// hide the cloned content within the li
				// show the span and img and enable the drag/drop
				$('#cck-blocks').children('li').each(function(index){

					var $this   = $(this),
						modNum  = $this.data('number'),
						modName = $this.data('name');

					$('.cck-mod-name, .cck-mod-thumb').show();

					$this.find('[data-number='+ modNum +'][data-name="'+ modName +'"]').hide();

				});

				// hide header and footer
				$('.cck-browser').find('#header').hide();
				$('.cck-browser').find('#mobile-header').hide();
				$('.cck-browser').find('#footer').hide();

				// enable dragging
				$('#cck-blocks').sortable('enable');
			}

		}

		// init that ish
		function cckInit(){

			cckModMenu();

			// Check URL's Hash
			var urlHash = window.location.hash.substring(1);
			if ( urlHash ){
				addSample();
			}

			// Create cck-Sub-menu From Array
			blocks.forEach(function(element){

				var blocksRows = [];

				$('#cck-sub-menu').append('<ul id="cck-'+ element.type +'"></ul>');

				for ( var i = 0; i <= element.count; i++ ){
					var elNum = i + 1,
						block = [
						'<li data-id="'+ element.id +'" data-name="'+ element.type +'" data-number="'+ elNum +'">',
							'<span class="cck-mod-name">'+ element.type +' #'+ elNum +'</span>',
							'<img class="cck-mod-thumb" src="../assets/images/customizer/components/'+ pageName + '/' + thumbnailSize +'/'+ element.type + '-' + elNum +'.jpg">',
						'</li>'
					].join(' ');
					blocksRows.push(block);
				}

				$('#cck-sub-menu ul#cck-' + element.type).append(blocksRows.join('\n\n'));

			});

			var blocksRows = []; //clear array

			// SORT AND DRAG
			// Make Blocks Sotrable
			var sortableParams = {
				opacity: 0.75,
				placeholder: "placeholder",
				revert: 300,
				distance: 10,
				refreshPositions: true,
				start: function(event, ui){
					$('.placeholder').height(ui.item.context.clientHeight);
					checkBlocksHeight();
				},
				out: function( event, ui ){
					setTimeout(function(){
						checkBlocksHeight();
					},50);
				},
				over: function( event, ui ){
					checkBlocksHeight();
				},
				stop: function( event, ui ){
					if ( window.droppedData ){
						var bigImage = $(ui.item).attr('style','').find('img').attr('src').replace(thumbnailSize, blockSize);
						$(ui.item).attr('style', '').find('img').attr('src', bigImage);
					}
				}
			};

			$('#cck-blocks').sortable(sortableParams).on( 'sortstop', function( event, ui ) {
				updateHash();
				checkBlocksHeight();
			});

			var draggingElement = $('.ui-draggable-dragging img');

			// Make Menu Items Draggable
			var draggableParams = {
				connectToSortable: "#cck-blocks",
				addClasses: false,
				scope: "#cck-blocks",
				helper: "clone",
				appendTo: 'body',
				distance: 50,
				disabled: false, // needs setting in order to enable/disable later
				drag: function(event, ui){

					setTimeout(function(){
						$('#cck-blocks-holder #cck-blocks > li.placeholder').attr('style', 'height: 100px');
					},50);

					$(window).mousemove(function( event ) {

						var windowY = event.pageY - $(window).scrollTop(),
							windowX = event.pageX;

						$('.ui-draggable-dragging').css({
							'top': $(window).scrollTop() + windowY - 50
						}).css({
							'left': windowX - 50
						}).css({
							'width': '100px!important'
						});
					});
				},
				start: function(event, ui){

					window.droppedData = 'dragStart';

					if ( draggingElement.height() > 100 ) {
						draggingElement.height('100px');
					}

				},
				stop: function(event, ui){

					setTimeout (function(){
						window.droppedData = '';
					},500);

					var bigImage       = draggingElement.length ? draggingElement.attr('src').replace(thumbnailSize, blockSize) : '',
						bigImageHeight = $('.ui-draggable-dragging img').attr('src') == undefined ? '' : $('.ui-draggable-dragging img').attr('src', bigImage).removeAttr('style').height();

					$('.placeholder').height(bigImageHeight);

					checkMaxSize();
				}
			};

			// prevent the default browser img dragging
			$('img').on('dragstart', function(e) {
				e.preventDefault();
			});

			$('#cck-sub-menu li').draggable(draggableParams).click(function(){

				if ( $('#cck-blocks > li').size() < maxBlocks ) {

					var bigImage   = $(this).attr('style','').find('img').attr('src').replace(thumbnailSize, blockSize),
						newElement = $(this).clone().appendTo($('#cck-blocks')).find('img').attr('src', bigImage);

					newElement.load(function(e) {
						setTimeout(function(){
							var position = $('#cck-blocks > li:last-child').position();
							$('body').finish().animate({
								scrollTop: position.top
							}, 500);
						}, 250);
					});

					$('#sortable').sortable('refresh');

					checkBlocksHeight();
					updateHash();
					checkMaxSize();
				}
			});

			// Trash Objects
			$('#cck-side-menu').droppable({
				accept: "#cck-blocks > li",
				activeClass: "active",
				hoverClass: "hovered",
				tolerance: "touch",
				drop: function(event, ui) {
					$(ui.draggable).remove();
					$('.placeholder').animate({
						height: 0,
						opacity: 0,
						borderWidth: 0
					}, 250);
					checkMaxSize();
					console.log('kobe!');
				}
			});

			// not sure what this does
			$('#cck-side-menu img').droppable({
				drop: function( event, ui ) {
					$(this).siblings( ".placeholder" ).remove();
					$('<li></li>').text( ui.draggable.text() ).insertAfter( this );
				}
			});



			// Share
			$('.customizer--share').on('click', function(e) {
				var url = window.location.href;
				$('#customizer--share').find('#shareurl').val(url).removeClass('notgenerated');
				customizerModals('#customizer--share');
			});

			// How it works
			$('.customizer--how').on('click', function(e) {
				customizerModals('#customizer--how');
			});

			// About
			$('.customizer--about').on('click', function(e) {
				customizerModals('#customizer--about');
			});

			// Export
			$('.customizer--download').on('click', function(e) {

				if ( ! $('.customizer--download').hasClass('preloader') ) {

					var allBlocks = [];

					// iterate through cloned hidden obj to convert to string of markup
					$.map($('#cck-blocks').children('li'), function(el){

						var modNum     = $(el).data('number'),
							modName    = $(el).data('name'),
							modContent = $(el).find('[data-number="'+ modNum +'"][data-name="'+ modName +'"]');

							var markup = modContent[0].outerHTML;

						allBlocks.push(markup);

					});

					// join em
					allBlocks     = allBlocks.join('');

					// convert back to jquery obj
					var content   = $.parseHTML(allBlocks);

					var cleanedBlocks = [];

					// iterate through and remove display none inline style
					// and push back into string
					$(content).each(function(){
						$(this).css('display', '');
						var markup = $(this)[0].outerHTML;
						cleanedBlocks.push(markup);
					});

					//
					cleanedBlocks = cleanedBlocks.join('');

					if ( allBlocks ) {

						$('.customizer--download')
							.addClass('preloader')
							.text('Working...')
							.append('<span class="progress"></span>');

						$('body').addClass('noscroll');

						download( pageName + '.html', cleanedBlocks);

						setTimeout(function(){
							$('.customizer--download')
								.removeClass('preloader')
								.text('Done!');
						}, 1000);

						setTimeout(function(){
							$('.customizer--download')
								.removeClass('preloader')
								.text('Export HTML/CSS');
							$('body').removeClass('noscroll');
						}, 2000);

					}
				}
			});

			// New Composition
			$('.cck-clear').click(function() {

				customizerModals('#customizer--clear');

				$('.btn--success').on('click', function(e){
					$.magnificPopup.close();

					$('#cck-blocks').empty();

					checkBlocksHeight();
					checkMaxSize();
					updateHash();

					$('body').removeClass('preview');

					setTimeout(function(){
						$('#cck-sub-menu').removeClass('cck-hidden');
						$('#cck-header').addClass('cck-visible');
						$('#cck-side-menu ul li:first-child').addClass('selected');
					}, 500);
				});

				$('.btn--error').on('click', function(e){
					$.magnificPopup.close();
				});

			});

			// Show/Hide menu on empty
			$('#cck-blocks').click(function(){
				if ( $(this).hasClass('empty') ){
					if ( $('body').hasClass('preview') ){
						$('.cck-toggle').click();
					}
					$('#cck-sub-menu').removeClass('cck-hidden');
					$('#cck-header').addClass('cck-visible');
					$('#cck-side-menu ul li:first-child').addClass('selected');
				}
			});

			// hide menu on bodyclick
			$(document).click(function(event) {
				if ( ! $(event.target).closest('#cck-blocks, #cck-menu').length ) {
					$('#cck-sub-menu, #cck-menu').addClass('cck-hidden');
					$('#cck-side-menu li.selected').removeClass('selected');
				};
			});

			// Menu Here
			$('#cck-menu').on( 'mouseleave', function() {
				$('#cck-sub-menu, #cck-menu').addClass('cck-hidden');
				$('#cck-side-menu li.selected').removeClass('selected');
			});

			// fancy menu
			$('#cck-side-menu > ul').menuAim({
				activate: function(event){
					if ( ! $('#cck-side-menu').hasClass('disabled') ) {
						$('#cck-sub-menu, #cck-menu').removeClass('cck-hidden');
						$('#cck-side-menu li.selected').removeClass('selected');
						$(event).addClass('selected');

						var currentItem = $(event).data('menu-item');

						$('#cck-sub-menu').scrollTop(0);
						$('#cck-sub-menu ul.cck-visible').removeClass('cck-visible');
						$('#cck-sub-menu ul#cck-' + currentItem).addClass('cck-visible');
					}
				},
				exitMenu: function() {
					return true;
				}
			});

			// Toggle sidebar
			$('.cck-toggle').click(function(e){
				e.preventDefault();

				$('body').toggleClass('preview');

				preview();
				checkMaxSize();

				if ( $('body').hasClass('preview') ) {

					Cookies.set('toggle','preview', {
						expires: 1
					});

				} else {

					Cookies.set('toggle','normal', {
						expires: 1
					});

				}

			});

			checkBlocksHeight();
			checkMaxSize();
			preview();

		}

	};

	$window.resize(function(event) {

	});

	$(document).ready(function(){
		CCK.init();
	});

})(window.jQuery);
