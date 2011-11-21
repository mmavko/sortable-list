

Sort = (function () {
	function _bind(f, scope) {
		return function () {
			f.apply(scope, arguments);
		}
	}
	var constructor = function (el, options) {
		$.extend(this, this.constructor.defaultOptions, options);
		this.$list = $(el).first().css({position: 'relative'})
			.on({
				mousemove: _bind(this.onMouseMove, this),
				mouseup: _bind(this.onMouseUp, this),
				mouseout: _bind(this.onMouseOut, this)
			});
		this.$items = this.$list.children(this.itemsSelector)
			.on({
				mousedown: _bind(this.onMouseDown, this)
			});
		this.$items.last().after(this.$items.last().clone().css('display', 'none'));
		this.$items = this.$list.children(this.itemsSelector);
		this.height = this.$items.get(1).offsetTop - this.$items.get(0).offsetTop;
	};
	constructor.defaultOptions = {
		itemsSelector: 'li'
	};
	constructor.prototype = {
		onMouseDown: function (e) {
			this.$target = $(e.target);
			this.$placeholder = this.$target.clone().html('&nbsp;');
			this.$target.css({
				width: this.$target.css('width'),
				position: 'absolute'
			});
			$.extend(this, this.$target.position());
			if (this.$items.index(this.$target.get(0)) == 0) this.$target.css('margin-top', 0);
			this.$target.css({
				top: this.top,
				left: this.left
			}).before(this.$placeholder);
			this.x1 = e.pageX;
			this.y1 = e.pageY;
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
		onMouseOut: function (e) {
			this.cancel();
		},
		onMouseUp: function (e) {
			this.end();
		},
		move: function (di) {
			if (di > 0) di++;
			this.$placeholder.detach();
			var
				i = this.$items.index(this.$target.get(0)),
				current, ci;
			if (i+di < 0) ci = 0;
			else if (i+di >= this.$items.length) ci = this.$items.length-1;
			else ci = i+di;
			current = this.$items.get(ci);
			$(current).before(this.$placeholder);
		},
		cancel: function () {
			if (!this.$target) return;
			this.$placeholder.remove();
			this.$target.css({
				position: '',
				top: '',
				left: '',
				'margin-top': '',
				width: ''
			});
			delete this.$placeholder;
			delete this.$target;
		},
		end: function () {
			if (!this.$target) return;
			this.$target.detach();
			this.$placeholder.before(this.$target);
			this.cancel();
			this.$items = this.$list.children(this.itemsSelector);
		}
	};
	return constructor;
})();



$(function () {
	new Sort($('ul#list'));
});
