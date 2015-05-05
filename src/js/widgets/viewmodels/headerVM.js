/*
 *
 * GeoCanViz viewer / Visionneuse GéoCanViz
 * gcviz.github.io/gcviz/License-eng.txt / gcviz.github.io/gcviz/Licence-fra.txt
 *
 * Header view model widget
 */
/* global locationPath: false */
(function() {
	'use strict';
	define(['jquery-private',
			'knockout',
			'media',
			'gcviz-gisprint',
			'gcviz-i18n',
			'gcviz-ko',
			'gcviz-func',
			'gcviz-gismap',
			'gcviz-vm-tbextract',
			'gcviz-vm-print',
			'gcviz-vm-tbdata',
			'gcviz-vm-tblegend',
			'gcviz-vm-help'
	], function($viz, ko, media, gisPrint, i18n, binding, gcvizFunc, gisM, extractVM, printVM, dataVM, legendVM, helpVM) {
		var initialize,
			printSimple,
			getRotationDegrees,
			vm;

		initialize = function($mapElem, mapid, config, isDataTbl) {
			// data model				
			var headerViewModel = function($mapElem, mapid, config, isDataTbl) {
				var _self = this,
					configAbout = config.about,
					configPrint = config.print,
					pathPrint = locationPath + 'gcviz/print/defaultPrint-' + window.langext + '.html',
					pathHelpBubble = locationPath + 'gcviz/images/helpBubble.png',
					$section = $viz('#section' + mapid),
					$mapholder = $viz('#' + mapid),
					$map = $viz('#' + mapid + '_holder'),
					$btnAbout = $mapElem.find('.gcviz-head-about'),
					$btnSave = $mapElem.find('.gcviz-head-save'),
					$saveUrl = $mapElem.find('#gcviz-head-save'),
					$menu = $mapElem.find('#gcviz-menu' + mapid),
					$btnFull = $mapElem.find('.gcviz-head-pop'),
					map = gcvizFunc.getElemValueVM(mapid, ['map', 'map'], 'js'),
					instrHeight = 36;

				// viewmodel mapid to be access in tooltip custom binding
				_self.mapid = mapid;

				// help bubble
				_self.imgHelpBubble = pathHelpBubble;

				// tools panel settings
				_self.xheightToolsOuter = ko.observable('max-height:100px!important');
				_self.xheightToolsInner = ko.observable('max-height:100px!important');

				// application title
				_self.headTitle = ko.observable(config.title.value);

				// tooltip, text strings
				_self.tpHelp = i18n.getDict('%header-tphelp');
				_self.tpPrint = i18n.getDict('%header-tpprint');
				_self.tpInset = i18n.getDict('%header-tpinset');
				_self.tpAbout = i18n.getDict('%header-tpabout');
				_self.tpSave = i18n.getDict('%header-tpsave');
				_self.tpFullScreen = i18n.getDict('%header-tpfullscreen');
				_self.lblMenu = i18n.getDict('%header-tools');

				// toolbars name
				_self.legendTitle = i18n.getDict('%toolbarlegend-name');
				_self.legendAlt = i18n.getDict('%toolbarlegend-alt');
				_self.drawTitle = i18n.getDict('%toolbardraw-name');
				_self.drawAlt = i18n.getDict('%toolbardraw-alt');
				_self.navTitle = i18n.getDict('%toolbarnav-name');
				_self.navAlt = i18n.getDict('%toolbarnav-alt');
				_self.dataTitle = i18n.getDict('%toolbardata-name');
				_self.dataAlt = i18n.getDict('%toolbardata-alt');
				_self.extractTitle = i18n.getDict('%toolbarextract-name');
				_self.extractAlt = i18n.getDict('%toolbarextract-alt');

				// about dialog box
				_self.lblAboutTitle = i18n.getDict('%header-tpabout');
				_self.isAboutDialogOpen = ko.observable(false);
				_self.aboutType = configAbout.type;

				if (_self.aboutType === 1) {
					_self.aboutInfo1 = configAbout.value;
				} else if (_self.aboutType === 2) {
					_self.aboutInfo1 = i18n.getDict('%header-aboutread');
					_self.aboutInfo2 = i18n.getDict('%linkopens');
					_self.aboutURL = configAbout.value;
					_self.aboutURLText = i18n.getDict('%header-abouttitle');
				}

				// print info
				_self.printInfo = {
					url: i18n.getDict('%header-printurl'),
					copyright: i18n.getDict('%header-printcopyright'),
					template: pathPrint,
					title: _self.headTitle()
				};

				// save map url dialog box
				_self.lblSaveDesc = i18n.getDict('%header-copyclip');
				if (window.browserOS === 'mac') {
					_self.lblSaveDesc = _self.lblSaveDesc.replace('CTRL+C', 'CMD+C');
				}
				_self.isSaveDialogOpen = ko.observable(false);
				_self.saveURL = ko.observable('');

				// fullscreen
				_self.isFullscreen = ko.observable(false);
				_self.isInsetVisible = ko.observable(true);
				_self.insetState = true;
				_self.fullscreenState = 0;
				_self.opencloseToolsState = 0;

				// tools initial setting
				_self.toolsInit = config.tools;

				_self.init = function() {
					var $menuCont = $viz('#gcviz-menu-cont' + mapid);

					// keep map size
					_self.heightSection = parseInt($section.css('height'), 10);
					_self.heightMap = parseInt($map.css('height'), 10);
					_self.widthSection = parseInt($section.css('width'), 10);
					_self.widthMap = parseInt($map.css('width'), 10);
					_self.headerHeight = parseInt($mapElem.css('height'), 10);

					// Set the toolbar container height
					setTimeout(function() {
						_self.adjustContainerHeight();
					}, 500);

					// set the active toolbar
					$menuCont.on('accordioncreate', function(event) {
						var value,
							items = event.target.getElementsByTagName('div'),
							len = items.length;

						while (len--) {
							value = items[len].getAttribute('gcviz-exp');
							if (value === 'true') {
								$menuCont.accordion('option', 'active', len);
							}
						}

						// if expand is false toggle (open by default)
						if (!_self.toolsInit.expand) {
							// need to be in timeout. If not, doesnt work
							setTimeout(function(){
								$menu.accordion('option', 'active', false);
							}, 500);
						}

						$menuCont.off('accordioncreate');
					});

					return { controlsDescendantBindings: true };
				};

				_self.showBubble = function(key, shift, keyType, id) {
					return helpVM.toggleHelpBubble(key, id);
				};

				_self.showExtractGrid = function(event, ui) {
					var panel = ui.newPanel;

					if (panel.hasClass('gcviz-tbextract-content')) {
						extractVM.showGrid(map, true);
					} else {
						extractVM.showGrid(map, false);
					}
				};

				_self.fullscreenClick = function() {
					// debounce the click to avoid resize problems
					gcvizFunc.debounceClick(function() {
						if (_self.fullscreenState === 0) {
							$viz('html').css('overflow', 'hidden');
							_self.requestFullScreen();
						} else {
							$viz('html').css('overflow', 'auto');
							_self.cancelFullScreen();
						}

						// remove tooltip if there (the tooltip is position before the fullscreen)
						$viz('.gcviz-tooltip').remove();
					}, 1000);
				};

				_self.printClick = function() {
					// Print the map
					if (configPrint.type === 3) {
						// this is the simple print. It doesn't use esri print task
						printSimple(map, _self.printInfo);
					} else {
						// print from our custom esri services
						printVM.togglePrint();
					}
				};

				_self.insetClick = function() {
					// trigger the insetVisibility custom binding (debounce the click to avoid resize problems)
					gcvizFunc.debounceClick(function() {
						var array;

						_self.insetState = !_self.insetState;
						_self.isInsetVisible(_self.insetState);

						// change first and last item for section tab if inset are visible or not
						if (_self.insetState) {
							array = $section.find('[tabindex = 0]');
							_self.first = array[0];
							_self.last = array[array.length - 1];
						} else {
							array = $section.find('[tabindex = 0]').not('.gcviz-inset-button');
							_self.first = array[0];
							_self.last = array[array.length - 1];
						}
					}, 1000);
				};

				_self.toolsClick = function() {
					var open = $menu.accordion('option', 'active');

					// Toggle the tools container
					if (open === 0) {
						$menu.accordion('option', 'active', false);
					} else {
						$menu.accordion('option', 'active', 0);
					}
				};

				_self.helpClick = function() {
					helpVM.toggleHelp();
				};

				_self.aboutClick = function() {
					_self.isAboutDialogOpen(true);
				};

				_self.dialogAboutOk = function() {
					_self.isAboutDialogOpen(false);
					$btnAbout.focus();
				};

				_self.saveClick = function(ev) {
					var mapUrl,
						extentString,
						dataString,
						legendString,
						extent = gisM.getMapExtent(map),
						url = window.location.toString(),
						url = url.substring(0, url.indexOf('html') + 4) + '?';

					// set extent
					extentString = 'extent=' + extent.xmin + ',' + extent.ymin + ',' + extent.xmax + ',' + extent.ymax;

					// set legend
					legendString = legendVM.getURL(_self.mapid);

					// set imported data
					dataString = dataVM.getURL(_self.mapid);

					// set map url
					mapUrl = url + extentString + dataString + legendString;
					_self.saveURL(mapUrl);
					_self.isSaveDialogOpen(true);

					// select the url and focus to input
					$saveUrl[0].setSelectionRange(0, mapUrl.length);
					$saveUrl.focus();
				};

				_self.dialogSaveOk = function() {
					_self.isSaveDialogOpen(false);
					$btnSave.focus();
				};

				_self.cancelFullScreen = function() {
					var resizeEvt,
						sectH = _self.heightSection,
						sectW = _self.widthSection,
						mapH = _self.heightMap,
						mapW = _self.widthMap;

					// set style back for the map
					gcvizFunc.setStyle($mapholder[0], { 'width': sectW + 'px', 'height': (sectH - instrHeight) + 'px' }); // remove the keyboard instruction height
					gcvizFunc.setStyle($map[0], { 'width': mapW + 'px', 'height': mapH + 'px' });
					$mapholder.removeClass('gcviz-sectionfs');

					// if datatable is enable, remove a class to have an overflow
					if (isDataTbl) {
						$mapholder.removeClass('gcviz-sectionfs-dg');
					}

					// trigger the fullscreen custom binding and set state
					_self.isFullscreen(false);
					_self.fullscreenState = 0;

					// set on resize event to know when to adjust menu height,
					// put back focus on fs and reset tab
					resizeEvt = map.on('resize', function() {
						_self.adjustContainerHeight();
						$btnFull.focus();

						// create keydown event to keep tab in the map section
						// remove the event that keeps tab in map section
						$mapholder.off('keydown.fs');

						// remove event
						resizeEvt.remove();
					});

					// resize map and keep the extent
					gisM.manageScreenState(map, 500, false);
				};

				_self.requestFullScreen = function() {
					// get maximal height and width from browser window and original height and width for the map
					var resizeEvt,
						param = gcvizFunc.getFullscreenParam(),
						h = param.height,
						array = $mapholder.find('[tabindex = 0]'),
						height = (h - (2 * _self.headerHeight) - 2); // minus 2 for the border

					// set style for the map
					gcvizFunc.setStyle($mapholder[0], { 'width': '100%', 'height': '100%' });
					gcvizFunc.setStyle($map[0], { 'width': '100%', 'height': height + 'px' });
					$mapholder.addClass('gcviz-sectionfs');

					// if datatable is enable, add a class to have an overflow
					if (isDataTbl) {
						$mapholder.addClass('gcviz-sectionfs-dg');
					}

					// trigger the fullscreen custom binding and set state
					_self.isFullscreen(true);
					_self.fullscreenState = 1;

					// set on resize event to know when to adjust menu height,
					// put back focus on fs and set tab
					resizeEvt = map.on('resize', function() {
						_self.adjustContainerHeight();
						$mapElem.find('.gcviz-head-reg').focus();

						// create keydown event to keep tab in the map section
						_self.first = array[0];
						_self.last = array[array.length - 1];
						$mapholder.on('keydown.fs', function(event) {
							_self.manageTabbingOrder(event);
						});

						// remove event
						resizeEvt.remove();
					});

					// resize map and keep the extent
					gisM.manageScreenState(map, 500, true);
				};

				_self.adjustContainerHeight = function() {
					var active = $menu.accordion('option', 'active'),
						toolbarheight = parseInt(map.height, 10) - 5;

					// set height
					_self.xheightToolsInner('max-height:' + (toolbarheight - instrHeight) + 'px!important'); // remove the keyboard instruction height
					_self.xheightToolsOuter('max-height:' + toolbarheight + 'px!important');

					// if menu was close we need to open it. Because the panel open automatically when we set the height,
					// we need to open it from the accorriodn. We use === false because active === 0.
					// we decide to have it open so you can choose back your tool. e.g. if you draw, goin to fs will stop the draw
					// and reopn the menu so we can choose draw again.
					if (active === false) {
						$menu.accordion('option', 'active', 0);
					}
				};

				_self.manageTabbingOrder = function(evt) {
					var key = evt.which,
						shift = evt.shiftKey,
						node = evt.target.className,
						firstClass = _self.first.className,
						lastClass = _self.last.className,
						firstItem = _self.first,
						lastItem = _self.last;

					if (key === 9 && !shift) {
						if (node === lastClass) {
							// workaround to avoid focus shifting to the next element
							setTimeout(function() { firstItem.focus(); }, 0);
						}
					} else if (key === 9 && shift) {
						if (node === firstClass) {
							// workaround to avoid focus shifting to the previous element
							setTimeout(function() {
								lastItem.focus();
							}, 0);

							// still focus on previous item. If not Chrome will freeze
							if (window.browser === 'Chrome') {
								lastItem.focus();
							}
						}
					}
				};

				_self.init();
			};

			vm = new headerViewModel($mapElem, mapid, config, isDataTbl);
			ko.applyBindings(vm, $mapElem[0]); // This makes Knockout get to work
			return vm;
		};

		printSimple = function(map, printInfo) {
			var style, rotation,
				styles, lenStyles,
				arrowStyle = '',
				center = {},
				mapid = map.vIdName,
				node = $viz('#' + mapid + '_holder'),
				arrow = $viz('#arrow' + mapid),
				scalebar = $viz('#scalebar' + mapid),
				zoomMax = $viz('.gcviz-map-zm'),
				zoomBar = $viz('.dijitSlider'),
				zoomPrevNext = $viz('.gcviz-map-zoompv'),
				height = node.css('height'),
				width = node.css('width');

			// get center map
			center.point = gisM.getMapCenter(map);

			// set map size to fit the print page
			gcvizFunc.setStyle(node[0], { 'width': '10in', 'height': '5.25in' });
			gcvizFunc.setStyle(node.find('#' + mapid + '_holder_root')[0], { 'width': '10in', 'height': '5.25in' });

			// resize map and center to keep scale
			center.interval = 1500;
			gisM.resizeCenterMap(map, center);

			// open the print page here instead of timemeout because if we do so, it will act as popup.
			// It needs to be in a click event to open without a warning
			window.open(printInfo.template);

			// hide zoom max, zoom bar and prev next
			zoomMax.addClass('gcviz-hidden');
			zoomBar.addClass('gcviz-hidden');
			zoomPrevNext.addClass('gcviz-hidden');

			// get rotation and remove decimal part
			rotation = getRotationDegrees(arrow);
			style = arrow.attr('style');
			styles = style.split(';');
			lenStyles = styles.length - 1;

			while (lenStyles--) {
				arrowStyle += styles[lenStyles].split(':')[0] + ':' + 'rotate(' + rotation + 'deg);';
			}

			// set the local storage (modify arrow because it wont print... it is an image background)
			localStorage.setItem('gcvizTitle', printInfo.title);
			setTimeout(function() {
				localStorage.setItem('gcvizPrintNode', node[0].outerHTML);
				localStorage.setItem('gcvizArrowNode', '<img src="../images/printNorthArrow.png" style="' + arrowStyle + '"></img>');
				localStorage.setItem('gcvizScalebarNode', scalebar[0].outerHTML);
				localStorage.setItem('gcvizURL', window.location.href);
			}, 3500);

			// set map size to previous values
			setTimeout (function() {
				zoomMax.removeClass('gcviz-hidden');
				zoomBar.removeClass('gcviz-hidden');
				zoomPrevNext.removeClass('gcviz-hidden');
				gcvizFunc.setStyle(node[0], { 'width': width, 'height': height });
				gcvizFunc.setStyle(node.find('#' + mapid + '_holder_root')[0], { 'width': width, 'height': height });
				gisM.resizeCenterMap(map, center);
			}, 15000);
		};

		// http://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery
		getRotationDegrees = function(obj) {
			var values, a, b, angle,
				matrix = obj.css('-webkit-transform') ||
				obj.css('-moz-transform') ||
				obj.css('-ms-transform') ||
				obj.css('-o-transform') ||
				obj.css('transform');

			if (matrix !== 'none') {
				values = matrix.split('(')[1].split(')')[0].split(',');
				a = values[0];
				b = values[1];
				angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
			} else {
				angle = 0;
			}

			if (angle < 0) {
				angle +=360;
			}

			return angle;
		};

		return {
			initialize: initialize
		};
	});
}).call(this);
