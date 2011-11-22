
Sort = (function () {
	function _bind(f, scope) {
		return function () {
			f.apply(scope, arguments);
		}
	}
	function Sort (el, options) {
		$.extend(this, this.constructor.defaultOptions, options);
		this.$list = $(el).first().css({position: 'relative'});
		$(document).on({
			mousemove: _bind(this.onMouseMove, this),
			mouseup: _bind(this.onMouseUp, this)
		});
		this.refreshItems();
		this.$items.on({
			mousedown: _bind(this.onMouseDown, this)
		});
		this.$items.last().after(this.$items.last().clone().css('display', 'none'));
		this.refreshItems();
		this.height = this.$items.get(1).offsetTop - this.$items.get(0).offsetTop;
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
			var
				dx = e.pageX - this.x1,
				dy = e.pageY - this.y1,
				di = Math.round(dy / this.height);
			this.$target.css({
				top: this.top + dy,
				left: this.left + dx
			});
			if (di !== this.lastDi) this.move(di);
			this.lastDi = di;
		},
		onMouseUp: function (e) {
			if (!this.$target) return;
			this.end();
		},
		start: function () {
			this.$placeholder = this.$target.clone().html('&nbsp;');
			var staticPos = this.$target.position();
			this.$target.css({
				width: this.$target.css('width'),
				position: 'absolute'
			});
			$.extend(this, this.$target.position());
			// include collapsed margins if any
			if (staticPos.top < 0) this.top += staticPos.top;
			this.$target.css({
				top: this.top,
				left: this.left
			}).before(this.$placeholder);
		},
		move: function (di) {
			// skip target item
			if (di > 0) di++;
			var
				i = this.$items.index(this.$target.get(0)),
				current, ci = i + di,
				maxi = this.$items.length-1;
			// move placeholder
			this.$placeholder.detach();
			if (ci < 0) ci = 0;
			if (i+di > maxi) ci = maxi;
			current = this.$items.get(ci);
			$(current).before(this.$placeholder);
		},
		end: function () {
			this.$target.detach();
			this.$placeholder.before(this.$target);
			this.stop();
			this.refreshItems();
		},
		stop: function () {
			this.$placeholder.remove();
			this.$target.css({
				position: '',
				top: '',
				left: '',
				width: ''
			});
			delete this.$placeholder;
			delete this.$target;
		}
	};
	return Sort;
})();
