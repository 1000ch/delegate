(function(window, undefined) {
	"use strict";

	var nativeSlice = Array.prototype.slice;
	var nativeForEach = Array.prototype.forEach;

	var simpleEvent = function(array) {
		var elementList = nativeSlice.call(array);
		var i, len = elementList.length;
		for(i = 0;i < len;i++) {
			this[i] = elementList[i];
		}
		this.closureList = {};
		return {
			delegate: function(type, selector, eventHandler) {
				_delegate(this, type, selector, eventHandler);
			},
			undelegate: function(type, selector, eventHandler) {
				_undelegate(this, type, selector, eventHandler);
			}
		};
	};

	function _closure = function() {
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
		return this;
	}

	function _undelegate(targetList, type, selector, eventHandler, useCapture) {
		var closure = _closure();
		nativeForEach.call(targetList, function(target) {
			target.removeEventListener(type, closure, useCapture);
		});
		return this;
	}

	window.simpleEvent = simpleEvent;

})(window);