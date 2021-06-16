
class Sortable
		
	@defaultOptions:
		itemSelector: 'li'
		triggerSelector: ''
		browserPrefix: '-webkit-'
		transitionDuration: '0.1'

	constructor: (el, options) ->
		$.extend @, Sortable.defaultOptions, options
		@$list = $(el).first()
		$(document).bind
			mousemove: @onMouseMove
			mouseup: @onMouseUp
		@$list.delegate "#{@itemSelector} #{@triggerSelector}", 'mousedown', @onMouseDown
		
	refreshItems: ->
		@$items = @$list.find @itemSelector
		if @$items.length > 1
			@height = @$items.get(1).offsetTop - @$items.get(0).offsetTop
		else
			@height = 0

	onMouseDown: (e) =>
		if @triggerSelector
			@$target = $(e.target).parent @itemSelector
		else
			@$target = $(e.target)
		@x1 = e.pageX
		@y1 = e.pageY
		@start()
		e.preventDefault()
		e.stopPropagation()

	onMouseMove: (e) =>
		return unless @$target
		@move e.pageX - @x1, e.pageY - @y1

	onMouseUp: (e) =>
		return unless @$target
		@end()
		delete @$target
		delete @x1
		delete @y1

	start: ->
		@refreshItems()
		# set items styles
		@$items.css 'position', 'relative'
		@$items.not(@$target).css "#{@browserPrefix}transition", "top #{@transitionDuration}s"
		@$target.css 'z-index', 1
		# store target index
		@ti = @$items.index @$target

	move: (dx, dy) ->
		@$target.css
			top: dy
			left: dx
		# index delta
		di = Math.round dy / @height
		return if di is @di
		@di = di
		# current index
		ci = @ti + @di
		# adjust positions
		@$items.each (i, item) =>
			return if i is @ti
			switch yes
				when i >= ci and i < @ti then top =	 @height
				when i <= ci and i > @ti then top = -@height
				else top = '0'
			$(item).css 'top', top

	end: ->
		# reset items styles
		@$items.css("#{@browserPrefix}transition", '').css
			position: ''
			top: ''
			left: ''
			'z-index': ''
		# current index
		ci = @ti + @di
		maxi = @$items.length - 1
		ci = 0    if ci < 0
		ci = maxi if ci > maxi
		# move item
		if @di < 0 then func = 'before' else func = 'after'
		$(@$items.get ci)[func] @$target unless ci is @ti
		delete @di
		delete @ti


if module? then module.exports = Sortable else @Sortable = Sortable
