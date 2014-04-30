/*global app, describe, ddescribe, it, iit, expect, runs, waitsFor, affix */

describe('app', function() {
    describe('calc', function() {
        it('should add numbers', function() {
            expect(app.calc(2, '+', 3)).toBe(5);
        });
    });
});