/*jslint browser: true, sloppy: true */

var micro = (function(window, document) {

    var ELEMENT_NODE = 1,
            IDEXPR = /^#(?:[\w\-]+)$/,
            IDTAGEXPR = /^#([\w\-]+) ([\w]+)$/,
            IDTAGATTREXPR = /^#([\w\-]+) ([\w]+)\[([\w]+)=["']{1}([\w]+)["']{1}\]$/;

    function toArray(arraylike) {
        var result, i, leni;
        try {
            return Array.prototype.slice.call(arraylike, 0);
        } catch (e) {
            result = [];
            for (i = 0, leni = arraylike.length; i < leni; i += 1) {
                result.push(arraylike[i]);
            }
            return result;
        }
    }

    function debounce(func, wait, immediate) {
        var timeout, result;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
            }
            return result;
        };
    }

    function on(element, names, handler) {
        names = names.split(' ');
        for (var i = 0, leni = names.length; i < leni; i++) {
            var name = names[i];
            if (element.addEventListener) {
                element.addEventListener(name, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + name, handler);
            } else {
                var oldHandler = element['on' + name];
                if (oldHandler) {
                    element['on' + name] = function() {
                        oldHandler.apply(this, arguments);
                        return handler.apply(this, arguments);
                    };
                } else {
                    element['on' + name] = handler;
                }
            }
        }
    }

    function getNodeName(element) {
        return element.nodeName.toUpperCase();
    }

    function getVal(element) {
        var i, leni, options, option, nodeName = getNodeName(element);
        if (nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'BUTTON') {
            return element.value;
        }
        if (nodeName === 'OUTPUT') {
            return element.innerHTML;
        }
        if (nodeName === 'SELECT') {
            options = toArray(element.options);
            for (i = 0, leni = options.length; i < leni; i += 1) {
                option = options[i];
                if (option.selected === true) {
                    return option.value;
                }
            }
            if (options.length > 0) {
                return options[0].value;
            }
        }
        return null;
    }

    function setVal(element, value) {
        var i, leni, options, option, nodeName = getNodeName(element);
        if (typeof value !== 'string') {
            value = String(value);
        }
        if (nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'BUTTON') {
            element.value = value;
        }
        if (nodeName === 'OUTPUT') {
            element.innerHTML = value;
        }
        if (nodeName === 'SELECT') {
            options = toArray(element.options);
            for (i = 0, leni = options.length; i < leni; i += 1) {
                option = options[i];
                if (option.value === value) {
                    option.selected = true;
                }
            }
        }
    }

    function MicroNode(element) {
        if (arguments.length === 1 &&
                typeof element === 'object' && (
                        (element.nodeType && element.nodeType === ELEMENT_NODE) ||
                        element === window ||
                        element === document
                        )) {
            this.element = element;
        } else {
            throw new Error('IllegalArgumentException');
        }
    }

    MicroNode.prototype.on = function(name, handler) {
        on(this.element, name, handler);
        return this;
    };

    MicroNode.prototype.val = function(value) {
        if (value === undefined) {
            return getVal(this.element);
        } else {
            setVal(this.element, value);
            return this;
        }
    };

    MicroNode.prototype.debounce = debounce;

    function byId(id) {
        return new MicroNode(document.getElementById(id));
    }

    function bySelector(selector) {
        var matches, id, tag, attr, val, potentials, i, leni;
        if (IDEXPR.test(selector)) {
            return byId(selector.substring(1));
        }
        if (IDTAGEXPR.test(selector)) {
            matches = selector.match(IDTAGEXPR);
            id = matches[1];
            tag = matches[2];
            return new MicroNode(document.getElementById(id).getElementsByTagName(tag)[0]);
        }
        if (IDTAGATTREXPR.test(selector)) {
            matches = selector.match(IDTAGATTREXPR);
            id = matches[1];
            tag = matches[2];
            attr = matches[3];
            val = matches[4];
            potentials = toArray(document.getElementById(id).getElementsByTagName(tag));
            for (i = 0, leni = potentials.length; i < leni; i += 1) {
                if (potentials[i].hasAttribute(attr) && potentials[i].getAttribute(attr) === val) {
                    return new MicroNode(potentials[i]);
                }
            }
        }
        return null;
    }

    var docReady = (function() {
        var readyList = [];
        var readyFired = false;
        var readyEventHandlersInstalled = false;
        var readyTimeout = null;
        function ready() {
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                readyList[i].call(null, publicmicro);
            }
            readyList = [];
        }
        return function(callback) {
            readyList.push(callback);
            if (readyFired || document.readyState === 'complete') {
                window.clearTimeout(readyTimeout);
                readyTimeout = window.setTimeout(ready, 1);
                return;
            } else if (!readyEventHandlersInstalled) {
                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', ready, false);
                    window.addEventListener('load', ready, false);
                } else {
                    document.attachEvent('onreadystatechange', function() {
                        if (document.readyState === 'complete') {
                            ready();
                        }
                    });
                    window.attachEvent('onload', ready);
                }
                readyEventHandlersInstalled = true;
            }
        };
    }());

    function publicmicro(arg0) {
        if (typeof arg0 === 'function') {
            docReady(arg0);
        }
        if (typeof arg0 === 'string') {
            return bySelector(arg0);
        }
        if (typeof arg0 === 'object') {
            return new MicroNode(arg0);
        }
    }

    publicmicro.debounce = debounce;

    return publicmicro;

}(window, document));