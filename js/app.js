micro(function(µ) {
    var f = µ('#form'),
            a1 = µ('#form input[name="a1"]'),
            a2 = µ('#form input[name="a2"]'),
            sign = µ('#form select[name="sign"]'),
            out = µ('#form output[name="out"]');
    function calc() {
        switch (sign.val()) {
            case '+':
                out.val(parseFloat(a1.val()) + parseFloat(a2.val()));
                break;
            default:
                out.val('ERROR');
        }
    }
    f.on('submit', function() {
        return false;
    });
    f.on('keyup change input', µ.debounce(calc, 100, false));
});