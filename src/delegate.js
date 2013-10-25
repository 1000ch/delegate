/**
 * event-expander.js
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
    var nativeSlice = Array.prototype.slice;
    var nativeMap = Array.prototype.map;
    var nativeForEach = Array.prototype.forEach;

    /**
     * just an alias of addEventListenr
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} useCapture
     */
    Node.prototype.bind = function(type, callback, useCapture) {
        this.addEventListener(type, callback, useCapture);
    };

    /**
     * just an alias of removeEventListener
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} useCapture
     */
    Node.prototype.unbind = function(type, callback, useCapture) {
        this.removeEventListener(type, callback, useCapture);
    };

    /**
     * callback will called once
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} useCapture
     */
    Node.prototype.once = function(type, callback, useCapture) {
        once(this, type, callback, useCapture);
    };

    /**
     * delegate
     * @param {String} type
     * @param {String} selector
     * @param {Function} callback
     */
    Node.prototype.delegate = function(type, selector, callback) {
        delegate(this, type, selector, callback);
    };

    /**
     * undelegate
     * @param {String} type
     * @param {String} selector
     * @param {Function} callback
     */
    Node.prototype.undelegate = function(type, selector, callback) {
        undelegate(this, type, selector, callback);
    };

    /**
     * bind
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} useCapture
     */
    NodeList.prototype.bind = function(type, callback, useCapture) {
        for(var i = 0, l = this.length;i < l;i++) {
            this[i].addEventListener(type, callback, useCapture);
        }
    };

    /**
     * unbind
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} useCapture
     */
    NodeList.prototype.unbind = function(type, callback, useCapture) {
        for(var i = 0, l = this.length;i < l;i++) {
            this[i].removeEventListener(type, callback, useCapture);
        }
    };

    /**
     * delegate
     * @param {String} type
     * @param {String} selector
     * @param {Function} callback
     */
    NodeList.prototype.delegate = function(type, selector, callback) {
        for(var i = 0, l = this.length;i < l;i++) {
            delegate(this[i], type, selector, callback);
        }
    };

    /**
     * undelegate
     * @param {String} type
     * @param {String} selector
     * @param {Function} callback
     */
    NodeList.prototype.undelegate = function(type, selector, callback) {
        for(var i = 0, l = this.length;i < l;i++) {
            undelegate(this[i], type, selector, callback);
        }
    };

    /**
     * bind once
     * @param {Node} target
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} useCapture
     */
    function once(target, type, callback, useCapture) {
        var wrapOnce = function(e) {
            callback.call(target, e);
            target.removeEventListener(type, wrapOnce, useCapture);
        };
        target.addEventListener(type, wrapOnce, useCapture);
    }

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

})(window);