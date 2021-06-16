(function() {
  var Sortable;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Sortable = (function() {

    Sortable.defaultOptions = {
      itemSelector: 'li',
      triggerSelector: '',
      browserPrefix: '-webkit-',
      transitionDuration: '0.1'
    };

    function Sortable(el, options) {
      this.onMouseUp = __bind(this.onMouseUp, this);
      this.onMouseMove = __bind(this.onMouseMove, this);
      this.onMouseDown = __bind(this.onMouseDown, this);      $.extend(this, Sortable.defaultOptions, options);
      this.$list = $(el).first();
      $(document).bind({
        mousemove: this.onMouseMove,
        mouseup: this.onMouseUp
      });
      this.$list.delegate("" + this.itemSelector + " " + this.triggerSelector, 'mousedown', this.onMouseDown);
    }

    Sortable.prototype.refreshItems = function() {
      this.$items = this.$list.find(this.itemSelector);
      if (this.$items.length > 1) {
        return this.height = this.$items.get(1).offsetTop - this.$items.get(0).offsetTop;
      } else {
        return this.height = 0;
      }
    };

    Sortable.prototype.onMouseDown = function(e) {
      if (this.triggerSelector) {
        this.$target = $(e.target).parent(this.itemSelector);
      } else {
        this.$target = $(e.target);
      }
      this.x1 = e.pageX;
      this.y1 = e.pageY;
      this.start();
      e.preventDefault();
      return e.stopPropagation();
    };

    Sortable.prototype.onMouseMove = function(e) {
      if (!this.$target) return;
      return this.move(e.pageX - this.x1, e.pageY - this.y1);
    };

    Sortable.prototype.onMouseUp = function(e) {
      if (!this.$target) return;
      this.end();
      delete this.$target;
      delete this.x1;
      return delete this.y1;
    };

    Sortable.prototype.start = function() {
      this.refreshItems();
      this.$items.css('position', 'relative');
      this.$items.not(this.$target).css("" + this.browserPrefix + "transition", "top " + this.transitionDuration + "s");
      this.$target.css('z-index', 1);
      return this.ti = this.$items.index(this.$target);
    };

    Sortable.prototype.move = function(dx, dy) {
      var ci, di;
      var _this = this;
      this.$target.css({
        top: dy,
        left: dx
      });
      di = Math.round(dy / this.height);
      if (di === this.di) return;
      this.di = di;
      ci = this.ti + this.di;
      return this.$items.each(function(i, item) {
        var top;
        if (i === _this.ti) return;
        switch (true) {
          case i >= ci && i < _this.ti:
            top = _this.height;
            break;
          case i <= ci && i > _this.ti:
            top = -_this.height;
            break;
          default:
            top = '';
        }
        return $(item).css('top', top);
      });
    };

    Sortable.prototype.end = function() {
      var ci, func, maxi;
      this.$items.css("" + this.browserPrefix + "transition", '').css({
        position: '',
        top: '',
        left: '',
        'z-index': ''
      });
      ci = this.ti + this.di;
      maxi = this.$items.length - 1;
      if (ci < 0) ci = 0;
      if (ci > maxi) ci = maxi;
      if (this.di < 0) {
        func = 'before';
      } else {
        func = 'after';
      }
      if (ci !== this.ti) $(this.$items.get(ci))[func](this.$target);
      delete this.di;
      return delete this.ti;
    };

    return Sortable;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Sortable;
  } else {
    this.Sortable = Sortable;
  }

}).call(window);
