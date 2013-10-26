/**
 * delegate.js
 *
 * Copyright 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined) {
  "use strict";

  var win = window;
  var doc = win.document;
  var rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/;

  //alias
  var arraySlice = Array.prototype.slice;
  var nativeMap = Array.prototype.map;
  var nativeForEach = Array.prototype.forEach;

  /**
   * base class
   * @param obj
   * @constructor
   */
  function Delegate(obj) {
    this.parents = [];
    if(obj.nodeType) {
      this.parents.push(obj);
    } else if(typeof obj.length === "number") {
      this.parents = arraySlice.call(obj);
    }
  }

  /**
   * delegate
   * @param {String} type
   * @param {String} selector
   * @param {Function} callback
   */
  Delegate.prototype.on = function(type, selector, callback) {
    var parents = this.parents;
    for(var i = 0, l = parents.length;i < l;i++) {
      delegate(parents[i], type, selector, callback);
    }
  };

  /**
   * undelegate
   * @param {String} type
   * @param {String} selector
   * @param {Function} callback
   */
  Delegate.prototype.off = function(type, selector, callback) {
    var parents = this.parents;
    for(var i = 0, l = parents.length;i < l;i++) {
      undelegate(parents[i], type, selector, callback);
    }
  };

  /**
   *
   * @param {Array} array
   * @param {String} key
   * @return {Array} plucked array
   */
  function pluck(array, key) {
    return nativeMap.call(array, function(value) {
      return value[key];
    });
  }

  /**
   * create callback closure
   * @param {HTMLElement} parentNode
   * @param {String} selector
   * @param {Function} callback
   */
  function createDelegateClosure(parentNode, selector, callback) {
    var closure = function(e) {
      var children = parentNode.querySelectorAll(selector);
      nativeForEach.call(children, function(child) {
        if(child.compareDocumentPosition(e.target) === 0) {
          callback.call(child, e);
        }
      });
    };
    return closure;
  }

  /**
   * delegate
   * @param {HTMLElement} targetNode
   * @param {String} type
   * @param {String} selector
   * @param {Function} callback
   */
  function delegate(targetNode, type, selector, callback) {
    if(!targetNode.eventStore) {
      targetNode.eventStore = {};
    }
    if(!targetNode.eventStore.hasOwnProperty(type)) {
      targetNode.eventStore[type] = [];
    }
    var closure = createDelegateClosure(targetNode, selector, callback);
    var closures = pluck(targetNode.eventStore[type], "closure");
    if(closures.indexOf(closure) === -1) {
      targetNode.eventStore[type].push({
        "selector": selector,
        "callback": callback,
        "closure": closure
      });
    }
    targetNode.addEventListener(type, closure);
  }

  /**
   * undelegate
   * @param {HTMLElement} targetNode
   * @param {String*} type
   * @param {String*} selector
   * @param {Function*} callback
   */
  function undelegate(targetNode, type, selector, callback) {
    var storedData, callbacks, selectors, index;
    if(targetNode.eventStore) {
      if(type && selector && callback) {
        storedData = targetNode.eventStore[type];
        callbacks = pluck(storedData, "callback");
        index = callbacks.indexOf(callback);
        if(index > -1) {
          targetNode.removeEventListener(type, storedData[index].closure);
          targetNode.eventStore[type].splice(index, 1);
        }
      } else if(type && selector && !callback) {
        storedData = targetNode.eventStore[type];
        selectors = pluck(storedData, "selector");
        index = selectors.indexOf(selector);
        if(index > -1) {
          targetNode.removeEventListener(type, storedData[index].closure);
          targetNode.eventStore[type].splice(index, 1);
        }
      } else if(type && !selector && !callback) {
        storedData = targetNode.eventStore[type];
        nativeForEach.call(storedData, function(item) {
          targetNode.removeEventListener(type, item.closure);
        });
        delete targetNode.eventStore[type];
      } else {
        Object.keys(targetNode.eventStore).forEach(function(key) {
          storedData = targetNode.eventStore[key];
          nativeForEach.call(storedData, function(item) {
            targetNode.removeEventListener(key, item.closure);
          });
          delete targetNode.eventStore[key];
        });
      }
    }
  }

  win.Delegate = Delegate;

})(window);