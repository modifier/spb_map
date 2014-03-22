$(document).ready(function () {
	var radius = 20;
	var circles = [];

	function initializeCircles () {
		var map = document.getElementById('svg_map');
		for (var i = 0; i < positions.length; i++) {
			var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			circle.setAttributeNS(null, 'cx', positions[i][0]);
			circle.setAttributeNS(null, 'cy', positions[i][1]);
			circle.setAttributeNS(null, 'fill', 'red');

			map.appendChild(circle);

			circles.push(circle);
		}
	}

	function refreshCircles () {
		var value = parseInt($('.slider').slider('value'), 10);
		$('.controls .text').text(value);

		for (var i = 0; i < circles.length; i++) {
			circles[i].setAttributeNS(null, 'r', value);
		}
	}

	$('.slider').slider({
		value: radius,
		max: 400,
		slide: refreshCircles,
		change: refreshCircles
	});

	initializeCircles();
	refreshCircles();
});