(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', 'exports', 'module', 'micro'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        factory(require, exports, module, require('micro'));
    } else {
        var require = function(name) {
            return root[name];
        }, exports = {}, module = {
            'exports': exports
        };
        factory(require, exports, module);
        root.app = module.exports;
    }
}(this, function(require, exports, module) {

    var micro = require('micro');

    function assertType(val, type) {
        if (typeof val !== type) {
            throw new Error('IllegalArgumentException');
        }
    }

    function calc(a1, op, a2) {
        assertType(a1, 'number');
        assertType(op, 'string');
        assertType(a2, 'number');
        switch (op) {
            case '+':
                return a1 + a2;
            default:
                return 'ERROR';
        }
    }

    function run() {
        var f = micro('#form'),
                a1 = micro('#form input[name="a1"]'),
                a2 = micro('#form input[name="a2"]'),
                op = micro('#form select[name="op"]'),
                out = micro('#form output[name="out"]');
        f.on('submit', function() {
            return false;
        });
        f.on('keyup change input', micro.debounce(function() {
            out.val(calc(
                    parseFloat(a1.val()),
                    op.val(),
                    parseFloat(a2.val())));
        }, 100, false));
    }

    module.exports = {
        'calc': calc,
        'run': run
    };

}));
