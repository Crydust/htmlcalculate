(function(window) {

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
                break;
            default:
                return 'ERROR';
        }
    }

    function run(µ) {
        var f = µ('#form'),
                a1 = µ('#form input[name="a1"]'),
                a2 = µ('#form input[name="a2"]'),
                op = µ('#form select[name="op"]'),
                out = µ('#form output[name="out"]');
        f.on('submit', function() {
            return false;
        });
        f.on('keyup change input', µ.debounce(function() {
            out.val(calc(
                    parseFloat(a1.val()),
                    op.val(),
                    parseFloat(a2.val())));
        }, 100, false));
    }

    var public = {
        'calc': calc,
        'run': run
    };

    window.app = public;

}(window));