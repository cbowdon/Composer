/*jslint node: true */
'use strict';

var assert = require('assert'),
    Buffer = require('../buffer').Buffer;

exports.tests = [
    function Buffer_startOfLine() {
        var text    = 'Hello\n\nworld,\nhello',
            buffer  = new Buffer(text);

        buffer.cursorToIndex(3);
        assert.strictEqual(buffer.startOfLine, 0, 'start of buffer');

        buffer.cursorToIndex(6);
        assert.strictEqual(buffer.startOfLine, 6, 'blank line');

        buffer.cursorToIndex(7);
        assert.strictEqual(buffer.startOfLine, 7, 'start of line');

        buffer.cursorToIndex(8);
        assert.strictEqual(buffer.startOfLine, 7, 'mid line');

        buffer.cursorToIndex(13);
        assert.strictEqual(buffer.startOfLine, 7, 'end of line');
    },

    function Buffer_endOfLine() {
        var text    = 'Hello\n\nworld,\nhello',
            buffer  = new Buffer(text);

        buffer.cursorToIndex(6);
        assert.strictEqual(buffer.endOfLine, 6, 'blank line');

        buffer.cursorToIndex(7);
        assert.strictEqual(buffer.endOfLine, 13, 'start of line');

        buffer.cursorToIndex(8);
        assert.strictEqual(buffer.endOfLine, 13, 'mid line');

        buffer.cursorToIndex(13);
        assert.strictEqual(buffer.endOfLine, 13, 'end of line');

        buffer.cursorToIndex(14);
        assert.strictEqual(buffer.endOfLine, text.length, 'end of buffer');
    },

    function Buffer_cursorPeek() {
        var buffer = new Buffer('Hello');

        assert.deepEqual(buffer.cursorCurrent(), { value: 'H', done: false }, 0);
        assert.strictEqual(buffer.cursorForward().value, 'e', 1);
        assert.strictEqual(buffer.cursorPeek(), 'l', 2);
    },

    function Buffer_cursorToIndex() {
        var buffer = new Buffer('Hello');

        assert.strictEqual(buffer.cursorToIndex(3).value, 'l');
        assert.strictEqual(buffer.cursorPosition(), 3);

        assert.strictEqual(buffer.cursorToIndex(0).value, 'H');
        assert.strictEqual(buffer.cursorPosition(), 0);

        assert.strictEqual(buffer.cursorToIndex(4).value, 'o');
        assert.strictEqual(buffer.cursorPosition(), 4);

        assert.strictEqual(buffer.cursorToIndex(2).value, 'l');
        assert.strictEqual(buffer.cursorPosition(), 2);

        assert.strictEqual(buffer.cursorToIndex(-1), undefined);
        assert.strictEqual(buffer.cursorPosition(), 2);

        assert.strictEqual(buffer.cursorToIndex(6), undefined);
        assert.strictEqual(buffer.cursorPosition(), 2);

        assert.deepEqual(buffer.cursorToIndex(5), { done: true });
        assert.strictEqual(buffer.cursorPosition(), 5);
    },

    function Buffer_cursorTo() {
        var text = "Hello, my baby,\nhello my honey,\nhello my ragtime gal\n",
            buffer = new Buffer(text);

        assert.strictEqual(buffer.cursorTo('\n').value, '\n', 'end of line 0');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf('\n'), 'end of line 0');

        assert.strictEqual(buffer.cursorTo('h').value, 'h', 'line 1');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf('h', 2), 'line 1');

        assert.strictEqual(buffer.cursorTo('\n').value, '\n', 'end of line 1');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf('\n', 20), 'end of line 1');

        assert.strictEqual(buffer.cursorTo('\n').value, '\n', 'end of line 1 (no movement)');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf('\n', 20), 'end of line 1 (no movement)');

        assert.strictEqual(buffer.cursorTo('z').value, '\n', 'end of line 1 (no movement)');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf('\n', 20), 'end of line 1 (no movement)');

        buffer.cursorForward();

        assert.strictEqual(buffer.cursorTo('\n').value, '\n', 'end of line 2');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf('\n', 40), 'end of line 2');
    },

    function Buffer_cursorBackTo() {
        var text = "Hello, my baby,\nhello my honey,\nhello my ragtime gal\n",
            buffer = new Buffer(text);

        buffer.cursorEnd();

        assert.strictEqual(buffer.cursorBackTo('g').value, 'g', 'line 2');
        assert.strictEqual(buffer.cursorPosition(), text.lastIndexOf('g'), 'line 2');

        assert.strictEqual(buffer.cursorBackTo('\n').value, '\n', 'line 1');
        assert.strictEqual(buffer.cursorPosition(), text.lastIndexOf('\n', 40), 'line 1');

        buffer.cursorBack();
        assert.strictEqual(buffer.cursorBackTo('\n').value, '\n', 'line 0');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf('\n'), 'line 0');

        buffer.cursorBack();
        assert.strictEqual(buffer.cursorBackTo('\n').value, ',', 'line 0 (no movement)');
        assert.strictEqual(buffer.cursorPosition(), text.indexOf(',', 10), 'line 0 (no movement)');
    },

    function Buffer_cursorStart() {
        var buffer = new Buffer('Hello');

        buffer.cursorForward(3);

        assert.deepEqual(buffer.cursorStart(), { value: 'H', done: false });
    },

    function Buffer_cursorEnd() {
        var buffer = new Buffer('Hello');

        buffer.cursorForward(3);

        assert.deepEqual(buffer.cursorEnd(), { done: true });
    },

    function Buffer_cursorDown() {
        var text = 'Hello, \nworld.\n\nIs it me...',
            buffer = new Buffer(text);

        buffer.cursorForward();
        assert.deepEqual(buffer.cursorDown(), { done: false, value: 'o' });
        assert.strictEqual(buffer.cursorPosition(), 8);

        assert.deepEqual(buffer.cursorDown(), { done: false, value: '\n' });
        assert.strictEqual(buffer.cursorPosition(), 15);

        assert.deepEqual(buffer.cursorDown(), { done: false, value: ' ' });
        assert.strictEqual(buffer.cursorPosition(), 17);

        assert.deepEqual(buffer.cursorDown(), { done: false, value: ' ' });
        assert.strictEqual(buffer.cursorPosition(), 17);
    },

    function Buffer_cursorUp() {
        var text = 'Hello, \nworld.\n\nIs\n it me...',
            buffer = new Buffer(text);

        buffer.cursorEnd();
        buffer.cursorBack(4);
        assert.deepEqual(buffer.cursorCurrent(), { value: 'e', done: false });

        assert.deepEqual(buffer.cursorUp(), { value: '\n', done: false });
        assert.deepEqual(buffer.cursorUp(), { value: '\n', done: false });
        assert.deepEqual(buffer.cursorUp(), { value: '.', done: false });
        assert.deepEqual(buffer.cursorUp(), { value: ',', done: false });
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

        buffer.cursorForward(3);

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

        buffer.cursorForward(3);

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

        buffer.cursorForward(3);

        assert.strictEqual(buffer.lastIndexOf('l'), 11);
        assert.strictEqual(buffer.lastIndexOf('l', 3), 3);
        assert.strictEqual(buffer.lastIndexOf('l', 2), 2);

        assert.strictEqual(buffer.lastIndexOf('H'), 0);
        assert.strictEqual(buffer.lastIndexOf('H', 1), 0);
        assert.strictEqual(buffer.lastIndexOf('H', 8), 0);
    },

];
