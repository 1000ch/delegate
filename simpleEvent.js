(function(window, undefined) {
	"use strict";

	var nativeSlice = Array.prototype.slice;
	var nativeForEach = Array.prototype.forEach;
	var nativeFilter = Array.prototype.filter;

	/**
	 * @param {Array} arary
	 */
	var simpleEvent = function(array) {
		var elementList = nativeFilter.call(array, function(item) {
			return !!item.nodeType
		}, array);
		this.length = elementList.length;
		for(var i = 0, len = this.length;i < len;i++) {
			this[i] = elementList[i];
		}
		this.closureList = {};
	};
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

	function _bind(targetList, type, eventHandler, useCapture) {
		nativeForEach.call(targetList, function(target) {
			target.addEventListener(type, eventHandler, useCapture);
		});
	}

	function _unbind(targetList, type, eventHandler, useCapture) {
		nativeForEach.call(targetList, function(target) {
			target.removeEventListener(type, eventHandler, useCapture);
		});
	}

	function _closure() {
		return function(e) {

		};
	}

	function _delegate(targetList, type, selector, eventHandler, useCapture) {
		var closure = _closure();
		if(!this.closureList.hasOwnProperty(type)) {
			this.closureList[type] = [];
		}
		if(this.closureList[type].indexOf(closure) < 0) {
			this.closureList[type].push(closure);
		}
		nativeForEach.call(targetList, function(target) {
			target.addEventListener(type, closure, useCapture);
		});
	}

	function _undelegate(targetList, type, selector, eventHandler, useCapture) {
		var closure = _closure();
		nativeForEach.call(targetList, function(target) {
			target.removeEventListener(type, closure, useCapture);
		});
	}

	window.simpleEvent = simpleEvent;

})(window);