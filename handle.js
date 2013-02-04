/**
 * handle.js
 *
 * Copyright 2012~, 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined) {
	"use strict";

	var qsa = "querySelectorAll";
	var rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/;

	//alias
	var nativeSlice = Array.prototype.slice;
	var nativeForEach = Array.prototype.forEach;
	var nativeFilter = Array.prototype.filter;

	/**
	 * @param {Array|NodeList} arary
	 */
	var Handle = function(obj) {
		var elementList = [];
		if(obj.length != undefined) {
			elementList = nativeFilter.call(obj, function(item) {
				return !!item.nodeType;
			}, obj);
		} else if(obj.nodeType != undefined) {
			elementList.push(array);
		}
		
		this.length = elementList.length;
		for(var i = 0, len = this.length;i < len;i++) {
			this[i] = elementList[i];
		}
	};
	//mapping
	Handle.prototype = {
		bind: function(type, eventHandler, useCapture) {
			_bind(this, type, eventHandler, useCapture);
			return this;
		},
		unbind: function(type, eventHandler, useCapture) {
			_unbind(this, type, eventHandler, useCapture);
			return this;
		},
		delegate: function(type, selector, eventHandler, useCapture) {
			_delegate(this, type, selector, eventHandler, useCapture);
			return this;
		},
		undelegate: function(type, selector, eventHandler, useCapture) {
			_undelegate(this, type, selector, eventHandler, useCapture);
			return this;
		}
	};

	/**
	 * bind
	 * @param {Array} targetList
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture
	 */
	function _bind(targetList, type, eventHandler, useCapture) {
		nativeForEach.call(targetList, function(target) {
			target.addEventListener(type, eventHandler, useCapture);
		});
	}

	/**
	 * unbind
	 * @param {Array} targetList
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture
	 */
	function _unbind(targetList, type, eventHandler, useCapture) {
		nativeForEach.call(targetList, function(target) {
			target.removeEventListener(type, eventHandler, useCapture);
		});
	}

	/**
	 * closure
	 * @param {HTMLElement} parent
	 * @param {String} selector
	 * @param {Function} eventHandler
	 */
	function _createClosure(parent, selector, eventHandler) {
		var closure = function(e) {
			var children = [];
			var match = rxConciseSelector.exec(selector);
			//shortcut for concise selectors
			if(match) {
				if(match[1]) {
					children.push(document.getElementById(match[1]));
				} else if(match[2]) {
					children = document.getElementsByTagName(match[2]);
				} else if(match[3]) {
					children = document.getElementsByClassName(match[3]);
				} else {
					//unexpected case
					children = document[qsa](selector);
				}
			} else {
				children = parent[qsa](selector);
			}
			nativeForEach.call(children, function(child) {
				if(e.target === child) {
					eventHandler.call(child, e);
				}
			});
		};
		return closure;
	}

	/**
	 * search item which match comparing data
	 * at specified property from array
	 * @param {Array} array
	 * @param {String} propertyName
	 * @param {Object} compareData
	 */
	function _searchIndex(array, propertyName, compareData) {
		var data;
		for(var i = 0, len = array.length;i < len;i++) {
			data = array[i];
			if(data[propertyName] == compareData) {
				return i;
			}
		}
		return -1;
	}

	//constant
	var CLOSURE = "closure";
	var EVENT_HANDLER = "eventHandler";
	var SELECTOR = "selector";

	/**
	 * delegate
	 * @param {Array} targetList
	 * @param {String} type
	 * @param {String} selector
	 * @param {Function} eventHandler
	 */
	function _delegate(targetList, type, selector, eventHandler) {
		var closure = null;
		nativeForEach.call(targetList, function(target) {
			if(!target.closureList) {
				target.closureList = {};
			}
			if(!target.closureList.hasOwnProperty(type)) {
				target.closureList[type] = [];
			}
			closure = _createClosure(target, selector, eventHandler);
			if(_searchIndex(target.closureList[type], CLOSURE, closure) < 0) {
				target.closureList[type].push({
					selector: selector,
					eventHandler: eventHandler,
					closure: closure
				});
			}
			target.addEventListener(type, closure);
		});
	}

	/**
	 * undelegate
	 * @param {Array} targetList
	 * @param {String} type
	 * @param {String*} selector
	 * @param {Function*} eventHandler
	 */
	function _undelegate(targetList, type, selector, eventHandler) {
		nativeForEach.call(targetList, function(target) {
			if(target.closureList && target.closureList.hasOwnProperty(type)) {
				if(type && selector && eventHandler) {
					var array = target.closureList[type];
					var idx = _searchIndex(array, EVENT_HANDLER, eventHandler);
					if(idx > -1) {
						target.removeEventListener(type, array[idx][CLOSURE]);
						target.closureList[type].splice(idx, 1);
					}
				} else if(type && selector && !eventHandler) {
					var array = target.closureList[type];
					var idx = _searchIndex(array, SELECTOR, selector);
					if(idx > -1) {
						target.removeEventListener(type, array[idx][CLOSURE]);
						target.closureList[type].splice(idx, 1);
					}
				} else if(type && !selector && !eventHandler) {
					var itemList = target.closureList[type];
					nativeForEach.call(itemList, function(item) {
						target.removeEventListener(type, item[CLOSURE]);
					});
					delete target.closureList[type];
				}
			}
		});
	}

	window.Handle = Handle;

})(window);