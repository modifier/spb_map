$(document).ready(function () {
	var RADIUS = 200,
		SCALE_CONVERSION = 700 / 75,
		circles = [],
		shownLines = [],
		crossStations = [];

	var $slider = $('.slider'),
		$checks = $('.checkboxes input[type=checkbox]')
		$map = $('.map');

	function initializeCircles () {
		function createCircle (params) {
			var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			circle.setAttributeNS(null, 'cx', params.cx);
			circle.setAttributeNS(null, 'cy', params.cy);
			circle.setAttributeNS(null, 'fill', params.fill);
			return circle;
		}

		var map = document.getElementById('svg_map');
		for (var key in positions) {
			if (key == '_cross_stations') {
				continue;
			}

			circles[key] = [];

			for (var i = 0; i < positions[key].stations.length; i++) {
				var circle = createCircle({
					cx: positions[key].stations[i][0],
					cy: positions[key].stations[i][1],
					fill: positions[key].color
				});
				map.appendChild(circle);
				circles[key].push(circle);
			}
		}

		circles['_cross_stations'] = [];

		for (var i = 0; i < positions['_cross_stations'].length; i++) {
			var circle = createCircle({
				cx: positions['_cross_stations'][i].position[0],
				cy: positions['_cross_stations'][i].position[1],
				fill: "gray"
			});
			map.appendChild(circle);
			circles['_cross_stations'].push(circle);

			crossStations.push({
				model: circle,
				lines: positions['_cross_stations'][i].lines
			});
		}
	}

	function refreshCircles () {
		var value = parseInt($slider.slider('value'), 10);
		$('.controls .text').text(value + 'm');

		for (var key in circles) {
			for (var i = 0; i < circles[key].length; i++) {
				circles[key][i].setAttributeNS(null, 'r', parseInt(value / SCALE_CONVERSION, 10));
			}
		}
	}

	function refreshCheckboxes () {
		shownLines  = [];
		$checks.each(function () {
			if ($(this).prop('checked')) {
				shownLines.push($(this).data('line'));
			}
		});
		
		(function refreshLines () {
			for (var key in circles) {
				if (key == '_cross_stations') {
					continue;
				}

				var show = $.inArray(key, shownLines) != -1 ? '' : 'none';
				for (var i = 0; i < circles[key].length; i++) {
					circles[key][i].style.display = show;
				}
			}

			for (var i = 0; i < circles['_cross_stations'].length; i++) {
				var model = circles['_cross_stations'][i];
				for (var j = 0; j < crossStations.length; j++) {
					if (crossStations[j].model == model) {
						break;
					}
				}

				var show = (function checkCrossStation (lines) {
					for (var i in shownLines) {
						if ($.inArray(shownLines[i], lines) != -1) {
							return true;
						}
					}
					return false;
				})(crossStations[j].lines) ? '' : 'none';
				circles[key][i].style.display = show;
			}
		})();
	}

	$slider.slider({
		value: RADIUS,
		max: 5000,
		slide: refreshCircles,
		change: refreshCircles
	});

	$checks.change(refreshCheckboxes);

	$('.checkboxes > div').click(function (e) {
		if ($(e.target).is('input')) {
			return;
		}

		var checkbox = $(this).find('input');
		var isChecked = checkbox.prop('checked');
		checkbox.prop('checked', !isChecked).change();
	});

	var dragStart = null;
	$map.mousedown(function (e) {
		dragStart = {
			clientX: e.clientX,
			clientY: e.clientY,
			scrollTop: $map.scrollTop(),
			scrollLeft: $map.scrollLeft()
		};

		$map.addClass('grabbing');
	});

	$map.mousemove(function (e) {
		if (dragStart === null) {
			return;
		}

		$map.scrollTop(dragStart.scrollTop + dragStart.clientY - e.clientY);
		$map.scrollLeft(dragStart.scrollLeft + dragStart.clientX - e.clientX);
	});

	$map.mouseup(function (e) {
		dragStart = null;

		$map.removeClass('grabbing');
	});

	initializeCircles();
	refreshCircles();
	refreshCheckboxes();
});