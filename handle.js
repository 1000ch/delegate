(function(window, undefined) {
	"use strict";

	var qsa = "querySelectorAll";

	//alias
	var nativeSlice = Array.prototype.slice;
	var nativeForEach = Array.prototype.forEach;
	var nativeFilter = Array.prototype.filter;

	/**
	 * @param {Array} arary
	 */
	var handle = function(array) {
		var elementList = nativeFilter.call(array, function(item) {
			return !!item.nodeType;
		}, array);
		this.length = elementList.length;
		for(var i = 0, len = this.length;i < len;i++) {
			this[i] = elementList[i];
		}
	};
	//mapping
	handle.prototype = {
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
	function _closure(parent, selector, eventHandler) {
		return function(e) {
			var children = parent[qsa](selector);
			nativeForEach.call(children, function(child) {
				if(e.target === child) {
					eventHandler.call(child, e);
					e.stopPropagation();
				}
			});
		};
	}

	function _search(array, propertyName, compareData) {
		var data;
		for(var i = 0, len = array.length;i < len;i++) {
			data = array[i];
			if(data[propertyName] == compareData) {
				return i;
			}
		}
		return -1;
	}

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
			closure = _closure(target, selector, eventHandler);
			if(_search(target.closureList[type], CLOSURE, closure) < 0) {
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
					var idx = _search(array, EVENT_HANDLER, eventHandler);
					if(idx > -1) {
						target.removeEventListener(type, array[idx][CLOSURE]);
						target.closureList[type].splice(idx, 1);
					}
				} else if(type && selector && !eventHandler) {
					var array = target.closureList[type];
					var idx = _search(array, SELECTOR, selector);
					if(idx > -1) {
						target.removeEventListener(type, array[idx][CLOSURE]);
						target.closureList[type].splice(idx, 1);
					}
				} else if(type && !selector && !eventHandler) {
					var closureList = target.closureList[type];
					nativeForEach.call(closureList, function(closure) {
						target.removeEventListener(type, closure);
					});
					delete target.closureList[type];
				}
			}
		});
	}

	window.handle = handle;

})(window);