/*global micro, describe, ddescribe, it, iit, expect, runs, waitsFor, affix */

describe('micro', function() {
    describe('select', function() {
        it('should find elements by id', function() {
            affix('#a');
            expect(micro('#a')).not.toBe(null);
        });
        it('should find elements by id and tag', function() {
            affix('#a div');
            expect(micro('#a div')).not.toBe(null);
        });
        it('should find elements by id, tag and attribute', function() {
            var $container = affix('#a');
            $container.affix('div[class="x"]');
            $container.affix('div[class="b"]');
            expect(micro('#a div[class="b"]')).not.toBe(null);
        });
        it('should return null when finding elements with a bad selector', function() {
            expect(micro('bad')).toBe(null);
        });
        it('should return null when the element can\'t be found', function() {
            expect(micro('#a')).toBe(null);
            expect(micro('#a div')).toBe(null);
            expect(micro('#a div[class="b"]')).toBe(null);
            affix('#a');
            expect(micro('#a div')).toBe(null);
            expect(micro('#a div[class="b"]')).toBe(null);
        });
    });
    describe('wrap', function() {
        it('should wrap elements in a MicroNode', function() {
            var el = affix('#a')[0];
            expect(micro(el)).not.toBe(null);
            expect(micro(el).element).toBe(el);
        });
        it('should throw an exception when the object is not an element', function() {
            expect(function() {
                micro(null);
            }).toThrow();
            expect(function() {
                micro({'foo':'bar'});
            }).toThrow();
        });
    });
    describe('val', function() {
        it('should get values from input elements', function() {
            var input = affix('input[value="a"]')[0];
            expect(micro(input).val()).toBe('a');
        });
        it('should set values on input elements', function() {
            var $input = affix('input');
            var input = $input[0];
            micro(input).val('a');
            expect($input.val()).toBe('a');
        });
        it('should set values on input elements even when the value isn\'t a string', function() {
            var $input = affix('input');
            var input = $input[0];
            micro(input).val(1);
            expect($input.val()).toBe('1');
        });
        it('should get values from select elements', function() {
            var $select = affix('select');
            var select = $select[0];
            expect(micro(select).val()).toBe(null);
            $select.affix('option[value="a"]');
            expect(micro(select).val()).toBe('a');
            $select.affix('option[value="b"][selected]');
            expect(micro(select).val()).toBe('b');
        });
        it('should set values on select elements', function() {
            var $select = affix('select');
            var select = $select[0];
            $select.affix('option[value="a"]');
            $select.affix('option[value="b"]');
            micro(select).val('b');
            expect($select.val()).toBe('b');
            micro(select).val('a');
            expect($select.val()).toBe('a');
        });
        it('should get values from output elements', function() {
            var $output = affix('output');
            $output.val('a');
            var output = $output[0];
            expect(micro(output).val()).toBe('a');
        });
        it('should set values on output elements', function() {
            var $output = affix('output');
            var output = $output[0];
            micro(output).val('a');
            expect($output.val()).toBe('a');
        });
        it('should throw an exception when the element can\'t have a value', function() {
            var $a = affix('a');
            var a = $a[0];
            expect(function() {
                micro(a).val();
            }).toThrow();
            expect(function() {
                micro(a).val('a');
            }).toThrow();
        });
    });
    describe('ready', function() {
        var value, flag;
        it('should load asynchronously', function() {
            flag = false;
            value = 0;

            micro(function() {
                flag = true;
            });
            waitsFor(function() {
                value++;
                return flag;
            }, "The Value should be incremented", 750);
            runs(function() {
                expect(value).toBeGreaterThan(0);
            });
        });
    });
    describe('debounce', function() {
        it('should run immediately, but only once', function() {
            var value = 0;
            var incrementor = micro.debounce(function() {
                value++;
            }, 1, true);
            incrementor();
            expect(value).toBe(1);
            incrementor();
            expect(value).toBe(1);
        });
        it('should run later', function() {
            var value = 0;
            var incrementor = micro.debounce(function() {
                value++;
            }, 1, false);
            incrementor();
            expect(value).toBe(0);
            incrementor();
            waitsFor(function() {
                return value === 1;
            }, "The Value should be incremented", 750);
            runs(function() {
                expect(value).toBe(1);
            });
        });
    });
});