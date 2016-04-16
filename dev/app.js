/* app.js
----------*/
(function app() {
	'use strict';



	// prevent default for href# and submits
	var stopIt = function(e) {
		e.preventDefault();
	};

	[].forEach.call(document.querySelectorAll('form button, a[href^="#"]'), function(node) {
		node.addEventListener('click',stopIt);
	});

})();
