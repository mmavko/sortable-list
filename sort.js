
Sort = (function () {
	function _bind(f, scope) {
		return function () {
			f.apply(scope, arguments);
		}
	}
	function Sort (el, options) {
		$.extend(this, this.constructor.defaultOptions, options);
		this.$list = $(el).first();
		this.refreshItems();
		this.$items.css('position', 'relative');
		this.height = this.$items.get(1).offsetTop - this.$items.get(0).offsetTop;
		$(document).on({
			mousemove: _bind(this.onMouseMove, this),
			mouseup: _bind(this.onMouseUp, this)
		});
		this.$items.on({
			mousedown: _bind(this.onMouseDown, this)
		});
	};
	Sort.defaultOptions = {
		itemsSelector: 'li'
	};
	Sort.prototype = {
		refreshItems: function () {
			this.$items = this.$list.children(this.itemsSelector);
		},
		onMouseDown: function (e) {
			this.$target = $(e.target);
			this.x1 = e.pageX;
			this.y1 = e.pageY;
			this.start();
			e.preventDefault();
		},
		onMouseMove: function (e) {
			if (!this.$target) return;
			this.move(e.pageX - this.x1, e.pageY - this.y1);
		},
		onMouseUp: function (e) {
			if (!this.$target) return;
			this.end();
			delete this.$target;
			delete this.x1;
			delete this.y1;
		},
		start: function () {
			this.$items.not(this.$target).css('-webkit-transition', 'top 0.1s');
			this.$target.css('z-index', 1);
			// store target index
			this.ti = this.$items.index(this.$target);
		},
		move: function (dx, dy) {
			this.$target.css({
				top: dy,
				left: dx
			});
			// index delta
			var di = Math.round(dy / this.height);
			if (di === this.di) return;
			this.di = di;
			// current index
			var ci = this.ti + this.di;
			// adjust positions
			this.$items.each(_bind(function (i, item) {
				if (i == this.ti) return true;
				var top = '';
				if (i >= ci && i < this.ti) top = this.height;
				if (i <= ci && i > this.ti) top = -this.height;
				$(item).css('top', top);
			}, this));
		},
		end: function () {
			this.$items.css({
				top: '',
				left: '',
				'-webkit-transition': '',
				'z-index': ''
			});
			var
				ci = this.ti + this.di,
				maxi = this.$items.length-1,
				func = 'after';
			if (ci < 0) ci = 0;
			if (ci > maxi) ci = maxi;
			if (this.di < 0) func = 'before';
			if (this.di !== 0) $(this.$items.get(ci))[func](this.$target);
			delete this.di;
			delete this.ti;
			this.refreshItems();
		}
	};
	return Sort;
})();
