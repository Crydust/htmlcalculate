(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', 'exports', 'module', 'docready'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        factory(require, exports, module);
    } else {
        var require = function(name) {
            return root[name];
        }, exports = {}, module = {
            'exports': exports
        };
        factory(require, exports, module);
        root.micro = module.exports;
    }
}(this, function(require, exports, module) {

    var docready = require('docready');

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
        } else if (nodeName === 'OUTPUT') {
            var value = element.value;
            if (value === undefined) {
                //IE11
                value = element.innerText;
            }
            return value;
        } else if (nodeName === 'SELECT') {
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
        } else {
            throw new Error('IllegalStateException');
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
        } else if (nodeName === 'OUTPUT') {
            element.innerText = value;
            element.value = value;
        } else if (nodeName === 'SELECT') {
            options = toArray(element.options);
            for (i = 0, leni = options.length; i < leni; i += 1) {
                option = options[i];
                if (option.value === value) {
                    option.selected = true;
                }
            }
        } else {
            throw new Error('IllegalStateException');
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
        var elById = document.getElementById(id);
        if (elById !== null) {
            return new MicroNode(elById);
        }
        return null;
    }

    function byIdAndTagName(id, tag) {
        var elById = document.getElementById(id);
        if (elById !== null) {
            var elsByTagName = elById.getElementsByTagName(tag);
            if (elsByTagName.length !== 0) {
                return new MicroNode(elsByTagName[0]);
            }
        }
        return null;
    }

    function byIdAndTagNameAndAttributeAndAttributeValue(id, tag, attr, val) {
        var i, leni;
        var elById = document.getElementById(id);
        if (elById !== null) {
            var potentials = elById.getElementsByTagName(tag);
            for (i = 0, leni = potentials.length; i < leni; i += 1) {
                if (potentials[i].hasAttribute(attr) && potentials[i].getAttribute(attr) === val) {
                    return new MicroNode(potentials[i]);
                }
            }
        }
        return null;
    }

    function bySelector(selector) {
        var matches, id, tag, attr, val;
        if (IDEXPR.test(selector)) {
            id = selector.substring(1);
            return byId(id);
        } else if (IDTAGEXPR.test(selector)) {
            matches = selector.match(IDTAGEXPR);
            id = matches[1];
            tag = matches[2];
            return byIdAndTagName(id, tag);
        } else if (IDTAGATTREXPR.test(selector)) {
            matches = selector.match(IDTAGATTREXPR);
            id = matches[1];
            tag = matches[2];
            attr = matches[3];
            val = matches[4];
            return byIdAndTagNameAndAttributeAndAttributeValue(id, tag, attr, val);
        }
        return null;
    }

    module.exports = function(arg0) {
        if (typeof arg0 === 'string') {
            return bySelector(arg0);
        } else if (typeof arg0 === 'object') {
            return new MicroNode(arg0);
        } else if (typeof arg0 === 'function') {
            docready(arg0);
        }
        return null;
    }

    module.exports.debounce = debounce;

}));