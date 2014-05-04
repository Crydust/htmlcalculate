/*global describe, ddescribe, it, iit, expect, runs, waitsFor, affix */

define(['app'], function(app) {
    describe('app', function() {
        describe('calc', function() {
            it('should add numbers', function() {
                expect(app.calc(2, '+', 3)).toBe(5);
            });
            it('should check input types', function() {
                expect(function() {
                    app.calc(null, '+', 3);
                }).toThrow();
                expect(function() {
                    app.calc(2, null, 3);
                }).toThrow();
                expect(function() {
                    app.calc(2, '+', null);
                }).toThrow();
            });
            it('should return ERROR for unsupported operations', function() {
                expect(app.calc(2, 'unsupported', 3)).toBe('ERROR');
            });
            it('should return NaN when appropriate', function() {
                expect(app.calc(NaN, '+', 3)).toBeNaN();
            });
        });
    });
});