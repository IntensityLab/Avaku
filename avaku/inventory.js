// This file is part of Avaku
// Copyright (C) 2010 Gio Carlo Cielo Borje
//
// Avaku is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Avaku is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Inventory system for the avatar.
 * 
 * @class Represents an inventory.
 * @param {ItemFactory} itemFactory	The factory which generates items for the
 *		inventory.
 */
function Inventory(itemFactory) {
	this.itemFactory = itemFactory;

	// First index is the category
	// Second is the item
	this.matrix = {}
	this.matrix['head'] = [];
	this.matrix['upper'] = [];
	this.matrix['lower'] = [];
	this.matrix['shoes'] = [];
}

Inventory.prototype = {
	/**
	 * Loads into the inventory a set of categorized items for a given user.
	 *
	 * @param {String} user		The user to fetch items for.
	 * @param {String} category	The category of items to fetch.
	 */
	getItems: function(user, category) {
		if (this.matrix[category].length === 0) {
			var items = this.itemFactory.getItems(user, category);
			this.matrix[category] = items;
		}
	},

	/**
	 * Prints the list equipped items on the screen at the specified document
	 * element.
	 *
	 * @param {Element} elem The document element to print the list of 
	 *		equipped items on.
	 */
	printEquipped: function(elem) {
		equippedHtml = '';
		equipped = [];
		algo.for_each(Avaku.avatar, function(layer) {
			var html =
				'<div class="item">' +
					'<a href="#" class="remove">x</a>' +
					'<a href="#" class="raise">+</a>' +
					'<a href="#" class="lower">-</a>' +
					'<a href="#" class="layer">' +
						'<img src="' + layer._img.src + 
						'" data-src="' + layer._img.src +
						'" width="120" height="165" />' +
					'</a>' +
				'</div>';
			equipped.unshift(html);
		});
		for (i in equipped)
			equippedHtml += equipped[i];
		elem.innerHTML = equippedHtml;
		Avaku.bindItemHandlers(
			algo.getByClass(config.ITEM_CLASS, elem));
	},

	/**
	 * Prints the list of items for a specified category on the screen at
	 * the specified document element.
	 *
	 * @param {Element} elem				The document element to print 
	 *		the list of items on.
	 * @param {String|String[]} category	The category (categories) of
	 *		items to print.
	 */
	printHtml: function(elem, category) {
		var matrixHtml = '';
		var items = [];
		if (algo.isArray(category)) {
			var categories = category;
			for (var i in categories)
				items = items.concat(this.matrix[category[i]]);
		} else {
			items = this.matrix[category];
		}
		for (var i in items) {
			if (items[i] === undefined)
				throw new Error('Invalid item: ' + items[i]);
			var html =
				'<div class="item">' +
					'<a href="#" class="remove">x</a>' +
					'<a href="#" class="raise">+</a>' +
					'<a href="#" class="lower">-</a>' +
					'<a href="#" class="layer">' +
						'<img src="' + items[i].source + 
						'" data-src="' + items[i].source +
						'" width="120" height="165" />' +
					'</a>' +
				'</div>';
			matrixHtml += html;
		}
		elem.innerHTML = elem.innerHTML + matrixHtml;
	}
};

