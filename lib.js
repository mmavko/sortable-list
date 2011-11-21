$ = (function () {
	var Nodes = function (selector) {
		switch (true) {
			case selector instanceof HTMLElement || selector instanceof Document:
				this.elements = [selector];
				break;
			case selector instanceof NodeList:
				this.elements = Array.prototype.slice.call(selector);
				break;
			case typeof selector === 'string':
				this.elements = Array.prototype.slice.call(document.querySelectorAll(selector));
				break;
			default:
				this.elements = selector;
		}
	};
	Nodes.prototype = {
		get: function (index) {
			return this.elements[index];
		},
		first: function () {
			return $(this.elements[0]);
		},
		each: function (callback) {
			this.elements.forEach(function (el) {
				callback.call(el, el);
			});
			return this;
		},
		on: function (event, listener) {
			var e, l;
			if (typeof event === 'object') {
				for (e in event) {
					l = event[e];
					this.elements.forEach(function (el) {
						el.addEventListener(e, l);
					});
				}
			}
			else {
				this.elements.forEach(function (el) {
					el.addEventListener(event, listener);
				});
			}
			return this;
		},
		children: function (selector) {
			var result = [];
			this.elements.forEach(function (el) {
				var children = document.querySelectorAll(selector, el);
				result = result.concat(Array.prototype.slice.call(children));
			});
			return $(result);
		},
		css: function (prop, val) {
			var p, v;
			if (typeof prop === 'object') {
				for (p in prop) {
					v = prop[p];
					this.elements.forEach(function (el) {
						el.style[p] = v;
					});
				}
			}
			else if (val) {
				this.elements.forEach(function (el) {
					el.style[prop] = val;
				});
			}
			else {
				return this.elements[0].style[prop];
			}
			return this;
		}
	};
	var $ = function (selector) {
		return selector instanceof Nodes ? selector : new Nodes(selector);
	};
	$.extend = function () {
		var result = arguments[0];
		Array.prototype.slice.call(arguments).forEach(function (obj, i) {
			if (i === 0) return;
			var k;
			for (k in obj) {
				result[k] = obj[k];
			}
		});
		return result;
	};
	return $;
})(); 
