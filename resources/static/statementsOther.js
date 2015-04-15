(function ($) {
	"use strict";

	$.fn.adcStatementsOther = function adcStatementsOther(options) {
		
		(options.responseWidth = options.responseWidth || "auto");
		(options.responseHeight = options.responseHeight || "auto");
		(options.imageAlign = options.imageAlign || '');
		(options.isSingle = Boolean(options.isSingle));
		(options.isMultiple = Boolean(options.isMultiple));
		(options.animate = Boolean(options.animate));
		(options.autoForward = Boolean(options.autoForward));
		(options.useRange = Boolean(options.useRange));
		
		var otherQIDarray = options.otherQID.split(","),
			otherRIDarray = options.otherRID.split(",");
								
		// Delegate .transition() calls to .animate() if the browser can't do CSS transitions.
		if (!$.support.transition) $.fn.transition = $.fn.animate;
		
		$( '.responseItem').css('visibility: hidden;');
		
		$(this).css({'max-width':options.maxWidth,'width':options.controlWidth});
		$(this).parents('.controlContainer').css({'width':'100%','overflow':'hidden'});
		
		if ( options.controlAlign === "center" ) {
			$(this).parents('.controlContainer').css({'text-align':'center'});
			$(this).css({'margin':'0px auto'});
		} else if ( options.controlAlign === "right" ) {
			$(this).css({'margin':'0 0 0 auto'});
		}
		
		if ( $(this).parents('.controlContainer').outerWidth() <= 350 ) options.columns = 1;
		if ( options.columns > 1 )  {
			// Try to make all the repsonses the same height
			$(this).find('.responseItem').css('height','');
			$(this).find('.column').css({'display':'block','width':'100%'});
			$(this).find('.responseItem').css({'display':'block','float':'left'}).width( (100/options.columns) + '%');
			var widthDiff = $('.responseItem').outerWidth(true) - $(this).find('.responseItem').innerWidth();
			$(this).find('.responseItem').width( (($('.column').outerWidth() - (widthDiff * options.columns))/options.columns) + "px" );
			var maxResponseHeight = Math.max.apply( null, $(this).find('.responseItem').map( function () {
				var thisHeight = $( this ).outerHeight();
				if ( $(this).find('.otherText').size() > 0 ) thisHeight -= $(this).find('.otherText').outerHeight(true);
				return thisHeight;
			}).get() );
			
			$(this).find('.responseItem').each(function() {
				if ( $(this).find('.otherText').size() > 0 ) $(this).css({'height':'auto', 'min-height':maxResponseHeight+'px'});
                else $(this).css({'height':maxResponseHeight+'px'});
            });
		}
		
		// Other
		$(this).parents('.controlContainer').find('.otherText').width( $(this).find('.responseItem').innerWidth() - 30 );
		//$(this).parents('.controlContainer').find('.otherText').width( '100%' );//.hide();
		
		//OLD if ( $( '#'+options.otherQID ).val() !== '' ) $(this).parents('.controlContainer').find('.otherText').val( $( '#'+options.otherQID ).val() );
		//OLD $( '#'+options.otherQID ).hide();
		/*
		var i;
		for (i = 0; i < otherQIDarray.length; ++i) {
			if ( $( '#'+otherQIDarray[i] ).val() !== '' ) 
				$(this).parents('.controlContainer').find('.responseItem[data-index="'+otherRIDarray[i]+'"] .otherText').val( $( '#'+otherQIDarray[i] ).val() );
			$( '#'+otherQIDarray[i] ).hide();
		}
		*/
		
		// Global variables
		var $container = $(this),
			items = options.items,
            isMultiple = options.isMultiple,
			total_images = $container.find("img").length,
			images_loaded = 0;
			
		console.log(items);
		
		//OLD if ( parseInt(options.otherRID) < 1 ) options.otherRID = items.length + 1 + parseInt(options.otherRID);
		/*for (i = 0; i < otherRIDarray.length; ++i) {
			if ( parseInt(otherRIDarray[i]) < 1 ) otherRIDarray[i] = String(items.length + 1 + parseInt(otherRIDarray[i]));
		}*/
		
		// Fix column width
		if ( parseInt(options.columns) > 1 && ( ($(this).find('.responseItem').eq(0).outerWidth(true) * parseInt(options.columns)) >= $(this).find('.column').eq(0).width() ) ) {
			var colWidthDiff = Math.ceil(($(this).find('.column').eq(0).width() - ($(this).find('.responseItem').eq(0).outerWidth(true) * parseInt(options.columns)))*0.5);
			$(this).find('.responseItem').width( $(this).find('.responseItem').eq(0).width() - (colWidthDiff + 1));
		}
			
		// Convert RGB to hex
		function trim(arg) {
			return arg.replace(/^\s+|\s+$/g, "");
		}
		function isNumeric(arg) {
			return !isNaN(parseFloat(arg)) && isFinite(arg);
		}
		function isRgb(arg) {
			arg = trim(arg);
			return isNumeric(arg) && arg >= 0 && arg <= 255;
		}
		function rgbToHex(arg) {
			arg = parseInt(arg, 10).toString(16);
			return arg.length === 1 ? '0' + arg : arg; 
		}
		function processRgb(arg) {
			arg = arg.split(',');
	
			if ( (arg.length === 3 || arg.length === 4) && isRgb(arg[0]) && isRgb(arg[1]) && isRgb(arg[2]) ) {
				if (arg.length === 4 && !isNumeric(arg[3])) { return null; }
				return '#' + rgbToHex(arg[0]).toUpperCase() + rgbToHex(arg[1]).toUpperCase() + rgbToHex(arg[2]).toUpperCase();
			}
			else {
				return null;
			}
		}
		
		function restoreRangeColour(index) {
			
			if ( options.useRange && !$container.find('.responseItem').eq(index).hasClass('ns') ) {
				
				var maxNumber = $container.find('.responseItem').size() - options.numberNS;
				var rangeArray = options.range.split(';');
				
				var rainbow1 = new Rainbow();
					rainbow1.setSpectrum(processRgb(rangeArray[0]), processRgb(rangeArray[2]));
					rainbow1.setNumberRange(0, maxNumber);
				var rainbow2 = new Rainbow();
					rainbow2.setSpectrum(processRgb(rangeArray[1]), processRgb(rangeArray[3]));
					rainbow2.setNumberRange(0, maxNumber);
					
				if ( options.rangeGradientDirection == 'ltr' ) { 
					return 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=1 )';
				} else {
					return 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=0 )';
				}
				
			} else {
				return '';	
			}
			
		}
		
		// For multi-coded question
		// Add the @valueToAdd in @currentValue (without duplicate)
		// and return the new value
		function addValue(currentValue, valueToAdd) {
			if (currentValue == '') {
				return valueToAdd;
			}

			var arr = String(currentValue).split(','), i, l, wasFound = false;

			for (i = 0, l = arr.length; i < l; i += 1) {
				if (arr[i] == valueToAdd) {
					wasFound = true;
					break;
				}
			}

			if (!wasFound) {
				currentValue += ',' + valueToAdd;
			}
			return currentValue;
		}

		// For multi-coded question
		// Remove the @valueToRemove from the @currentValue
		// and return the new value
		function removeValue(currentValue, valueToRemove) {
			if (currentValue === '') {
				return currentValue;
			}
			var arr = String(currentValue).split(','),
                        i, l,
                        newArray = [];
			for (i = 0, l = arr.length; i < l; i += 1) {
				if (arr[i] != valueToRemove) {
					newArray.push(arr[i]);
				}
			}
			currentValue = newArray.join(',');
			return currentValue;
		}
		
		// Select a statement
		// @this = target node
		function selectStatementSingle() {

			var $input = items[0].element,
				$target = $(this),
				value = $target.attr('data-value');

			$container.find('.selected').each( function() {
				$(this).removeClass('selected').css('filter',restoreRangeColour($(this).data('id')));
			});
			$target.addClass('selected');
			$input.val(value);
						
			// OLD if ( $target.data('id') == (parseInt(options.otherRID)-1) ) $(this).parents('.controlContainer').find('.otherText').show().focus();
			$(this).parents('.controlContainer').find('.otherText').val('');
			for (i = 0; i < otherQIDarray.length; ++i) {
				$( '#'+otherQIDarray[i] ).val('');
			}
			//$(this).parents('.controlContainer').find('.otherText').hide();
			
			/*if ( $.inArray( String(parseInt($target.data('id'))+1), otherRIDarray ) != -1 ) {
				var otherID = $.inArray( String(parseInt($target.data('id'))+1), otherRIDarray );
				$(this).parents('.controlContainer').find('.otherText').eq(otherID).show().focus();
			}*/
			//if ( $.inArray( String(parseInt($target.data('index'))), otherRIDarray ) != -1 ) {
				//var otherID = $.inArray( String(parseInt($target.data('index'))), otherRIDarray );
				$(this).find('.otherText').show().focus();
			//}
			
			// if auto forward do something
			// OLD if ( options.autoForward && $target.data('id') != parseInt(options.otherRID) ) $(':input[name=Next]:last').click();
			if ( options.autoForward && $.inArray( String(parseInt($target.data('index'))), otherRIDarray ) == -1 ) $(':input[name=Next]:last').click();
			
		}
		

		// Select a statement for multiple
		// @this = target node
		function selectStatementMulitple() {
			
			var $target = $(this),
				value = $target.data('value'),
				$input = items[$target.data('id')].element,
				isExclusive = Boolean(items[$target.data('id')].isExclusive),
				currentValue = $input.val();
				
			if ($target.hasClass('selected')) {
				// Un-select

				$target.removeClass('selected').css('filter',restoreRangeColour($(this).data('id')));
				//$input.prop('checked', false);
				currentValue = removeValue(currentValue, value);
				// hide other
				// OLD if ( $target.data('id') == (parseInt(options.otherRID)-1) ) {
				if ( $.inArray( String(parseInt($target.data('index'))), otherRIDarray ) != -1 ) {
					
					//FIX
					//var otherID = $.inArray( String(parseInt($target.data('index'))), otherRIDarray );
					//$(this).find('.otherText').hide();
					$(this).find('.otherText').val('');
					$( '#'+otherQIDarray[otherID] ).val('');
				}

			} else {

				// Select

				if (!isExclusive) {
					
					// Check if any exclusive
					currentValue = addValue(currentValue, value);
					var otherID = $.inArray( String(parseInt($(this).data('index'))), otherRIDarray );
					//if ( $.inArray( String(parseInt($target.data('index'))), otherRIDarray ) != -1 ) 
						$(this).find('.otherText').show().focus();

					// Un-select all exclusives
					$container.find('.exclusive').each(function forEachExclusives() {
						$(this).removeClass('selected').css('filter',restoreRangeColour($(this).data('id')));
						currentValue = removeValue(currentValue, $(this).data('value'));
						//OLD if ( $(this).data('id') == (parseInt(options.otherRID)-1) ) {
						if ( $.inArray( String(parseInt($(this).data('index'))), otherRIDarray ) != -1 ) {
							//FIX
							var otherID = $.inArray( String(parseInt($(this).data('index'))), otherRIDarray );
							$(this).find('.otherText').val('');
							$( '#'+otherQIDarray[otherID] ).val('');
							//$(this).find('.otherText').hide();
						}
					});

				} else {

					// When exclusive un-select all others
					$container.find('.selected').each( function() {
						$(this).removeClass('selected').css('filter',restoreRangeColour($(this).data('id')));
					});
					currentValue = value;
					//OLD if ( $target.data('id') != ( parseInt(options.otherRID)-1) ) {
					if ( $.inArray( String(parseInt($target.data('index'))), otherRIDarray ) == -1 ) {
						//FIX
						$(this).parents('.controlContainer').find('.otherText').val('');
						for (i = 0; i < otherQIDarray.length; ++i) {
							$( '#'+otherQIDarray[i] ).val('');
						}
						//$(this).parents('.controlContainer').find('.otherText').hide();
					} else  $(this).parents('.controlContainer').find('.otherText').show().focus();

				}
				$target.addClass('selected');
			}

			// Update the value
			$input.val(currentValue);
		}
		
		$("input").bind("keydown", function(event) {
			if (event.which === 13) {
				event.stopPropagation();
				event.preventDefault();
				$(this).next("input").focus();
			}
		});
		
		function writeText() {
			items[parseInt($(this).data('id'))-1].element.val( $(this).val() );
		}
		
		function showNext() {
			$( '#responseItem' + (parseInt($(this).data('id'))+1)).show();
			if (event.which === 13) {
				if($( '#responseItem' + (parseInt($(this).data('id'))+1)).length){
					event.stopPropagation();
					event.preventDefault();
					if($( '#responseItem' + (parseInt($(this).data('id')))).find('.otherText').val() == ""){
						$(':input[name=Next]:last').click();
					}
					$( '#responseItem' + (parseInt($(this).data('id'))+1)).find('.otherText').focus();
				} else {
					$(':input[name=Next]:last').click();
				}
			}
		}
		
		$( '.otherText' ).focus(function(srcc) {
			$( '#responseItem' + (parseInt($(this).data('id')))).show().addClass('selected');
			if ($(this).val() == $(this)[0].title) {
				$(this).removeClass("defaultTextActive");
				$(this).val("");
			}
		});
		
		$( '.otherText' ).blur(function() {
			if ($(this).val() == "") {
				$(this).addClass("defaultTextActive");
				$(this).val($(this)[0].title);
			}
		});
		
		$(this).parents('.controlContainer').find( '.otherText' ).blur();  
				
		
		$(this).parents('.controlContainer').find( '.otherText' ).keyup(writeText).click(function(e) {
			e.stopPropagation();
		});
		
		$(this).parents('.controlContainer').find( '.otherText' ).keydown(showNext);
		
		// Check for missing images and resize
		$container.find('.responseItem img').each(function forEachImage() {
			var size = {
				width: $(this).width(),
				height: $(this).height()
			};
			
			if (options.forceImageSize === "height" ) {
				if ( size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}
			} else if (options.forceImageSize === "width" ) {
				if ( size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}
				
			} else if (options.forceImageSize === "both" ) {
				if ( parseInt(options.maxImageHeight,10) > 0 && size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}
	
				if ( parseInt(options.maxImageWidth,10) > 0 && size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}
				
			} 
			$(this).css(size);
		});
		
		// If image align is center
		if (options.imageAlign === "center") {
			$(this).find('.responseItem img').css({'margin-left':'auto','margin-right':'auto'});
			$(this).find('.responseItem').css({'text-align':'center'});
		}
		
		// add ns to last x items
		if ( options.numberNS > 0 ) $(this).parents('.controlContainer').find('.responseItem').slice(-options.numberNS).addClass('ns');
		
		// Use range if on
		if ( options.useRange ) {
			var maxNumber = $(this).find('.responseItem').size() - options.numberNS;
			var rangeArray = options.range.split(';');
			
			var rainbow1 = new Rainbow();
				rainbow1.setSpectrum(processRgb(rangeArray[0]), processRgb(rangeArray[2]));
				rainbow1.setNumberRange(0, maxNumber);
			var rainbow2 = new Rainbow();
				rainbow2.setSpectrum(processRgb(rangeArray[1]), processRgb(rangeArray[3]));
				rainbow2.setNumberRange(0, maxNumber);
			$('.responseItem').slice(0,(options.numberNS > 0)?0-options.numberNS:$(this).find('.responseItem').size()).each(function( index ) {

				if ( options.rangeGradientDirection == 'ltr' ) { 
					$(this).css({ 'background': '#'+rainbow1.colourAt(index) });
					$(this).css({ 'background': '-moz-linear-gradient(left,  #'+rainbow1.colourAt(index)+' 0%, #'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-webkit-gradient(linear, left top, right top, color-stop(0%,#'+rainbow1.colourAt(index)+'), color-stop(100%,#'+rainbow2.colourAt(index)+'))' });
					$(this).css({ 'background': '-webkit-linear-gradient(left, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-o-linear-gradient(left, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-ms-linear-gradient(left, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': 'linear-gradient(to right, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'filter': 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=1 )' });
				} else {
					$(this).css({ 'background': '#'+rainbow1.colourAt(index) });
					$(this).css({ 'background': '-moz-linear-gradient(top,  #'+rainbow1.colourAt(index)+' 0%, #'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-webkit-gradient(linear, left top, left bottom, color-stop(0%,#'+rainbow1.colourAt(index)+'), color-stop(100%,#'+rainbow2.colourAt(index)+'))' });
					$(this).css({ 'background': '-webkit-linear-gradient(top, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-o-linear-gradient(top, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-ms-linear-gradient(top, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': 'linear-gradient(to bottom, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'filter': 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=0 )' });
				}
				
			});
		}
		
		// Retrieve previous selection
		if ( !isMultiple ) {
			
			var $input = items[0].element;
			var currentValue = $input.val();
								
			$container.find('.responseItem').each(function (index) {
				$(this).data('id',index);
				var value = $(this).data('value'),
					isSelected = $(this).data('value') == currentValue ? true : false;
				if (isSelected) {
					$(this).addClass('selected');
					// Other
					//FIX
					//OLD if ( $(this).data('id') == ( parseInt(options.otherRID)-1 ) ) $(this).parents('.controlContainer').find('.otherText').show().focus();
					//if ( $.inArray( String(parseInt($(this).data('index'))), otherRIDarray ) != -1 ) {
							//var otherID = $.inArray( String(parseInt($(this).data('index'))), otherRIDarray );
							//$(this).parents('.controlContainer').find('.otherText').eq(otherID).show().focus();
							$(this).parents('.controlContainer').find('.otherText').show().focus();
						//}
					
				} else {
					$(this).removeClass('selected').css('filter',restoreRangeColour($(this).data('id')));
				}
			});
		
		
		} else if ( isMultiple ) {
			
			var $input = items[0].element;
			var currentValues = String($input.val()).split(","),
				currentValue;
			
			for ( var i=0; i<currentValues.length; i++ ) {
				//currentValue = items[i].element.val();
				currentValue = currentValues[i];
				$container.find('.responseItem').each(function (index) {
					$(this).data('id',index);
					var value = $(this).data('value'),
						isSelected = $(this).data('value') == currentValue ? true : false;
					if (isSelected) {
						$(this).addClass('selected');
						// Other
						//FIX
						//OLD if ( $(this).data('id') == ( parseInt(options.otherRID)-1 ) ) $(this).parents('.controlContainer').find('.otherText').show().focus();
						//if ( $.inArray( String(parseInt($(this).data('index'))), otherRIDarray ) != -1 ) {
							//var otherID = $.inArray( String(parseInt($(this).data('index'))), otherRIDarray );
							//$(this).parents('.controlContainer').find('.otherText').eq(otherID).show().focus();
							$(this).parents('.controlContainer').find('.otherText').show().focus();
						//}
					}
					
				});
				
				// Other
				//if ( currentValue == (parseInt(options.otherRID) - 1) ) $(this).parents('.controlContainer').find('.otherText').show();
			}
		}
		
		// Attach all events
		$container.on('click', '.responseItem', (!isMultiple) ? selectStatementSingle : selectStatementMulitple);
		
		if ( total_images > 0 ) {
			$container.find('img').each(function() {
				var fakeSrc = $(this).attr('src');
				$("<img/>").css('display', 'none').load(function() {
					images_loaded++;
					if (images_loaded >= total_images) {
						
						// now all images are loaded.
						$container.css('visibility','visible');
						
						if ( options.animate ) {
							var delay = 0,
								easing = (!$.support.transition)?'swing':'snap';
							
							$container.find('.responseItem').each(function forEachItem() {
								$(this).css({ y: 2000, opacity: 0 }).transition({ y: 0, opacity: 1, delay: delay }, options.animationSpeed, easing);
								delay += 30;
							});
						}
	
					}
				}).attr("src", fakeSrc);
			});
		} else {
			$container.css('visibility','visible');
			if ( options.animate ) {
				var delay = 0,
					easing = (!$.support.transition)?'swing':'snap';
				
				$container.find('.responseItem').each(function forEachItem() {
					$(this).css({ y: 2000, opacity: 0 }).transition({ y: 0, opacity: 1, delay: delay }, options.animationSpeed, easing);
					delay += 30;
				});
			}
		}
		
		//hide all properly
		$( '.responseItem').hide();
		$( '.responseItem').css('');
		
		//show first response box
		for ( var l=1; l<(options.initialRows+1); l++ ) {
			$( '#responseItem' + l + '').show();
		}
		
		for ( var k=0; k<items.length; k++ ) {
			if(items[parseInt(k)].element.val().length > 0){
				$( '#responseItem' + (k + 1) + '').find( '.otherText' ).val('' + items[parseInt(k)].element.val() + '');
				$( '#responseItem' + (k + 1) + '').addClass('selected');
				$( '#responseItem' + (k + 1) + '').show();
				
				//show next 
				$( '#responseItem' + (k + 2) + '').show();
			}
		}


		// animate to top if error message
		if ( $('#error-summary, .error').size() > 0 ) $("html, body").animate({ scrollTop: 0 }, "fast");

		// Returns the container
		return this;
	};

} (jQuery));