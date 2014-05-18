/*jslint node: true */
'use strict';

var assert = require('assert'),
    Buffer = require('../buffer').Buffer;

exports.tests = [
    function Buffer_startOfLine() {
        var text    = 'Hello\n\nworld,\nhello',
            buffer  = new Buffer(text),
            cursor  = buffer.cursor;

        cursor.toIndex(3);
        assert.strictEqual(buffer.startOfLine, 0, 'start of buffer');

        cursor.toIndex(6);
        assert.strictEqual(buffer.startOfLine, 6, 'blank line');

        cursor.toIndex(7);
        assert.strictEqual(buffer.startOfLine, 7, 'start of line');

        cursor.toIndex(8);
        assert.strictEqual(buffer.startOfLine, 7, 'mid line');

        cursor.toIndex(13);
        assert.strictEqual(buffer.startOfLine, 7, 'end of line');
    },

    function Buffer_endOfLine() {
        var text    = 'Hello\n\nworld,\nhello',
            buffer  = new Buffer(text),
            cursor  = buffer.cursor;

        cursor.toIndex(6);
        assert.strictEqual(buffer.endOfLine, 6, 'blank line');

        cursor.toIndex(7);
        assert.strictEqual(buffer.endOfLine, 13, 'start of line');

        cursor.toIndex(8);
        assert.strictEqual(buffer.endOfLine, 13, 'mid line');

        cursor.toIndex(13);
        assert.strictEqual(buffer.endOfLine, 13, 'end of line');

        cursor.toIndex(14);
        assert.strictEqual(buffer.endOfLine, text.length, 'end of buffer');
    },

    function Buffer_findForward() {
        var buffer = new Buffer('Hello, \nworld');

        buffer.cursor.right();

        assert.strictEqual(buffer.findForward('H'), -1, "H");
        assert.strictEqual(buffer.findForward('e'), 0, "e");
        assert.strictEqual(buffer.findForward('l'), 1, "l");
        assert.strictEqual(buffer.findForward('o'), 3, "o");
    },

    function Buffer_findBack() {
        var buffer = new Buffer('Hello');

        buffer.cursor.right(3);

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

        buffer.cursor.right(3);

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
        assert.strictEqual(buffer.lastIndexOf('w', 0), -1);

        buffer.cursor.right(3);

        assert.strictEqual(buffer.lastIndexOf('l'), 11);
        assert.strictEqual(buffer.lastIndexOf('l', 3), 3);
        assert.strictEqual(buffer.lastIndexOf('l', 2), 2);

        assert.strictEqual(buffer.lastIndexOf('H'), 0);
        assert.strictEqual(buffer.lastIndexOf('H', 1), 0);
        assert.strictEqual(buffer.lastIndexOf('H', 8), 0);
    },

];
