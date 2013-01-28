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
	var simpleEvent = function(array) {
		var elementList = nativeFilter.call(array, function(item) {
			return !!item.nodeType;
		}, array);
		this.length = elementList.length;
		for(var i = 0, len = this.length;i < len;i++) {
			this[i] = elementList[i];
		}
	};
	//mapping
	simpleEvent.prototype = {
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

	/**
	 * delegate
	 * @param {Array} targetList
	 * @param {String} type
	 * @param {String} selector
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture
	 */
	function _delegate(targetList, type, selector, eventHandler, useCapture) {
		var closure = null;
		nativeForEach.call(targetList, function(target) {
			if(!target.closureList) {
				target.closureList = {};
			}
			if(!target.closureList.hasOwnProperty(type)) {
				target.closureList[type] = [];
			}
			closure = _closure(target, selector, eventHandler);
			if(target.closureList[type].indexOf(closure) < 0) {
				target.closureList[type].push(closure);
			}
			target.addEventListener(type, closure, useCapture);
		});
	}

	/**
	 * undelegate
	 * @param {Array} targetList
	 * @param {String} type
	 * @param {String} selector
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture
	 */
	function _undelegate(targetList, type, selector, eventHandler, useCapture) {
		var closure = null;
		nativeForEach.call(targetList, function(target) {
			if(target.closureList && target.closureList.hasOwnProperty(type)) {
				closure = _closure(target, selector, eventHandler);
				var idx = target.closureList[type].indexOf(closure);
				if(idx > -1) {
					target.removeEventListener(type, closure, useCapture);
					target.closureList.splice(idx, 1);
				}
			}
			target.removeEventListener(type, closure, useCapture);
		});
	}

	window.simpleEvent = simpleEvent;

})(window);