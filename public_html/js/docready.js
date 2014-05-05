define(function(require, exports, module) {

    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    var readyTimeout = null;

    function ready() {
        readyFired = true;
        for (var i = 0; i < readyList.length; i++) {
            readyList[i].call(null);
        }
        readyList = [];
    }

    module.exports = function(callback) {
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

});