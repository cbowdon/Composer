/*jslint node: true */
'use strict';

var assert = require('assert'),
    Buffer = require('../buffer').Buffer;

exports.tests = [

    function Buffer_cursorPeek() {
        var buffer = new Buffer('Hello');

        assert.strictEqual(buffer.cursorCurrent(), 'H', 0);
        assert.strictEqual(buffer.cursorForward().value, 'e', 1);
        assert.strictEqual(buffer.cursorPeek(), 'l', 2);
    },

    function Buffer_cursorTo() {
        var buffer = new Buffer('Hello');

        assert.strictEqual(buffer.cursorTo(3), 'l');
        assert.strictEqual(buffer.cursorPosition(), 3);

        assert.strictEqual(buffer.cursorTo(0), 'H');
        assert.strictEqual(buffer.cursorPosition(), 0);

        assert.strictEqual(buffer.cursorTo(4), 'o');
        assert.strictEqual(buffer.cursorPosition(), 4);

        assert.strictEqual(buffer.cursorTo(2), 'l');
        assert.strictEqual(buffer.cursorPosition(), 2);

        assert.strictEqual(buffer.cursorTo(-1), undefined);
        assert.strictEqual(buffer.cursorPosition(), 2);

        assert.strictEqual(buffer.cursorTo(5), undefined);
        assert.strictEqual(buffer.cursorPosition(), 2);
    },

    function Buffer_cursorStart() {
        var buffer = new Buffer('Hello');

        buffer.cursorForward();
        buffer.cursorForward();
        buffer.cursorForward();

        assert.strictEqual(buffer.cursorStart(), 'H');
    },

    function Buffer_cursorEnd() {
        var buffer = new Buffer('Hello');

        buffer.cursorForward();
        buffer.cursorForward();
        buffer.cursorForward();

        assert.strictEqual(buffer.cursorEnd(), undefined);
    },

    function Buffer_cursorUp() {
        assert.fail("not yet implemented.");
    },

    function Buffer_cursorDown() {
        assert.fail("not yet implemented.");
    },

    function Buffer_findForward() {
        var buffer = new Buffer('Hello, \nworld');

        buffer.cursorForward();

        assert.strictEqual(buffer.findForward('H'), -1, "H");
        assert.strictEqual(buffer.findForward('e'), 0, "e");
        assert.strictEqual(buffer.findForward('l'), 1, "l");
        assert.strictEqual(buffer.findForward('o'), 3, "o");
    },

    function Buffer_findBack() {
        var buffer = new Buffer('Hello');

        buffer.cursorForward();
        buffer.cursorForward();
        buffer.cursorForward();

        assert.strictEqual(buffer.findBack('H'), 3, "H");
        assert.strictEqual(buffer.findBack('e'), 2, "e");
        assert.strictEqual(buffer.findBack('l'), 0, "l");
        assert.strictEqual(buffer.findBack('o'), -1, "o");
    },

    function Buffer_indexOf() {
        var buffer = new Buffer('Hello, \nworld');

        assert.strictEqual(buffer.indexOf('\n'), 7, "\\n");
        assert.strictEqual(buffer.indexOf('w'), 8, "w");
        assert.strictEqual(buffer.indexOf('w', 1), 8, "w, 1");

        buffer.cursorForward();
        buffer.cursorForward();
        buffer.cursorForward();

        assert.strictEqual(buffer.indexOf('w', 1), 8, "w, 1 (cursor+3)");
        assert.strictEqual(buffer.indexOf('e', 6), -1, "e, 6 (cursor+3)");
        assert.strictEqual(buffer.indexOf('f'), -1, "f (cursor+3)");
        assert.strictEqual(buffer.indexOf('e', 1), 1, "e (cursor+3)");
    },

    function Buffer_lastIndexOf() {
        var buffer = new Buffer('Hello, \nworld!');

        assert.strictEqual(buffer.lastIndexOf('o'), 9);
        assert.strictEqual(buffer.lastIndexOf('o', 7), 4);
        assert.strictEqual(buffer.lastIndexOf('x'), -1);
        assert.strictEqual(buffer.lastIndexOf('x', 3), -1);

        buffer.cursorForward();
        buffer.cursorForward();
        buffer.cursorForward();

        assert.strictEqual(buffer.lastIndexOf('l'), 11);
        assert.strictEqual(buffer.lastIndexOf('l', 3), 3);
        assert.strictEqual(buffer.lastIndexOf('l', 2), 2);

        assert.strictEqual(buffer.lastIndexOf('H'), 0);
        assert.strictEqual(buffer.lastIndexOf('H', 1), 0);
        assert.strictEqual(buffer.lastIndexOf('H', 8), 0);
    },

];
