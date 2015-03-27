(function($, undef){

	$.customSelect = function(element, options) {

		var base = this;

		base.select = $(element);
		base.wrapper = null;

		base.select.data('customSelect', base);

		/**
		 * Initialize custom select
		 */
		base.init = function() {

			var items = base.select.find('option'),
				selected = base.select.find('option[selected]').length ? base.select.find('option[selected]').eq(0) : items.eq(0),
				itemsLength = items.length,
				ul = $('<ul />'),
				selectedWrapper,
				item,
				li,
				i;

			base.options = $.extend(true, {}, $.customSelect.defaultOptions, options);

			base.wrapper = $('<div />').addClass(base.options.classNames.wrapper);
			selectedWrapper = $('<div />').addClass(base.options.classNames.selected).html('<span>' + base.getContent(selected) + '</span>');

			if (base.options.classNames.arrow) {
				selectedWrapper.append($('<i />').addClass(base.options.classNames.arrow));
			}

			base.wrapper.append(selectedWrapper);

			for (i = 0; i < itemsLength; i++) {

				item = items.eq(i);
				li = $('<li />').html(base.getContent(item));
				ul.append(li);

				if (base.options.hideSelected && i === selected.index()) {
					li.hide();
				}

				if (i === selected.index() && base.options.classNames.selectedItem) {
					li.addClass(base.options.classNames.selectedItem);
				}
			}

			base.wrapper.append(ul);

			base.select.after(base.wrapper);
			base.select.addClass(base.options.classNames.hidden);

			base.wrapper.on('click', function() {
				base.showItems(items);
			});

			base.select.on('change', function () {
				base.setSelected(this.selectedIndex, items);
			});

			if (typeof base.options.onInit === 'function') {
				base.options.onInit(base.wrapper, items);
			}
		};

		/**
		 * Hide the items
		 * @param {object} items - jQuery elements
		 */
		base.hideItems = function(items) {

			if (typeof base.options.onClose === 'function') {
				base.options.onClose(items);
			}

			$(document).off('click');

			base.wrapper.removeClass(base.options.classNames.open);
			base.wrapper.off('click');

			base.wrapper.on('click', function() {
				base.showItems(items);
			});

			if (typeof base.options.onClosed === 'function') {
				base.options.onClosed(items);
			}
		};

		/**
		 * Show the items
		 * @param {object} items - jQuery elements
		 */
		base.showItems = function(items) {

			if (typeof base.options.onOpen === 'function') {
				base.options.onOpen(items);
			}

			base.wrapper.addClass(base.options.classNames.open);
			base.wrapper.off('click');

			if (typeof base.options.onOpened === 'function') {
				base.options.onOpened(items);
			}

			setTimeout(function() {

				$(document).on('click', function() {
					base.hideItems(items);
				});

			}, 0);

			base.wrapper.on('click', function() {
				base.hideItems(items);
			});

			base.wrapper.on('click', 'li', function (e) {

				e.stopPropagation();

				var index = $(e.currentTarget).index();

				base.setSelected(index, items);
				base.hideItems(items);
			});
		};

		/**
		 * Set selected item
		 * @param {number} index
		 * @param {object} items - jQuery elements
		 */
		base.setSelected = function(index, items) {

			if (typeof base.options.onChange === 'function') {
				base.options.onChange(items.eq(index), index);
			}

			if (base.options.hideSelected) {
				base.wrapper.find('li').show().eq(index).hide();
			}

			if (base.options.classNames.selectedItem) {
				base.wrapper.find('li').removeClass(base.options.classNames.selectedItem);
				base.wrapper.find('li').eq(index).addClass(base.options.classNames.selectedItem);
			}

			var selectedWrapper = base.wrapper.find('.' + base.options.classNames.selected);

			selectedWrapper.html('<span>' + base.getContent(items.eq(index)) + '</span>');

			if (base.options.classNames.arrow) {
				selectedWrapper.append($('<i />').addClass(base.options.classNames.arrow));
			}

			base.select
				.find('option')
				.prop('selected', false)
				.eq(index)
				.prop('selected', true);

			if (typeof base.options.onChanged === 'function') {
				base.options.onChanged(items.eq(index), index);
			}
		};

		/**
		 * Get item markup
		 * @param {object} item - jQuery element
		 */
		base.getContent = function(item) {

			var html = '';

			if (item.data('img')) {
				html += '<img src="' + item.data('img') + '" alt="' + item.text() + '" />';
			}

			if (base.options.hideText === false) {
				html += item.data('img') ? '<span>' + item.text() + '</span>' : item.text();
			}

			return html;
		};

		base.init();
	};

	$.customSelect.defaultOptions = {
		classNames: {
			wrapper: 'custom-select',
			selected: 'selected',
			open: 'open',
			hidden: 'hidden',
			arrow: 'icon-arrow-down',
			selectedItem: 'selected-item'
		},
		hideSelected: false,
		hideText: false,
		onInit: undef,
		onChange: undef,
		onChanged: undef,
		onOpen: undef,
		onOpened: undef,
		onClose: undef,
		onClosed: undef
	};

	$.fn.customSelect = function(options) {
		return this.each(function() {
			(new $.customSelect(this, options));
		});
	};

})(window.jQuery);
