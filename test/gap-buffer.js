/*jslint node: true */
'use strict';

var assert      = require('assert'),
    GapBuffer   = require('../gap-buffer').GapBuffer;

exports.tests = [

    function GapBuffer_insert() {
        var gapBuffer = new GapBuffer(', world');

        assert.strictEqual(gapBuffer.toString(), ', world');

        gapBuffer
            .insert('H')
            .insert('e')
            .insert('l')
            .insert('l')
            .insert('o');

        assert.strictEqual(gapBuffer.toString(), 'Hello, world');
    },

    function GapBuffer_update() {
        var gapBuffer = new GapBuffer('Hello, world');

        gapBuffer.cursorForward();
        gapBuffer.update('u');

        assert.strictEqual(gapBuffer.cursorCurrent(), 'u');
        assert.strictEqual(gapBuffer.toString(), 'Hullo, world');
    },

    function GapBuffer_delete() {
        var gapBuffer = new GapBuffer('Hello, world');

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.cut(), 'l');
        assert.strictEqual(gapBuffer.toString(), 'Helo, world');
    },

    function GapBuffer_cursor() {
        var gapBuffer = new GapBuffer('Hello');

        assert.strictEqual(gapBuffer.cursorCurrent(), 'H', 0);
        assert.deepEqual(gapBuffer.cursorBack(), { done: true }, 1);
        assert.strictEqual(gapBuffer.cursorForward().value, 'e', 2);
        assert.strictEqual(gapBuffer.cursorForward().value, 'l', 3);
        assert.strictEqual(gapBuffer.cursorBack().value, 'e', 4);
        assert.strictEqual(gapBuffer.cursorForward().value, 'l', 5);
        assert.strictEqual(gapBuffer.cursorForward().value, 'l', 6);
        assert.strictEqual(gapBuffer.cursorForward().value, 'o', 7);
        assert.deepEqual(gapBuffer.cursorForward(), { done: true }, 8);
        assert.strictEqual(gapBuffer.cursorBack().value, 'o', 9);
    },

    function GapBuffer_cursorPosition() {
        var gapBuffer = new GapBuffer('Hello');

        assert.strictEqual(gapBuffer.cursorPosition(), 0);

        gapBuffer.cursorForward();
        assert.strictEqual(gapBuffer.cursorPosition(), 1);
        gapBuffer.cursorForward();
        assert.strictEqual(gapBuffer.cursorPosition(), 2);

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        assert.strictEqual(gapBuffer.cursorPosition(), 5);

        gapBuffer.cursorForward();
        assert.strictEqual(gapBuffer.cursorPosition(), 5);

        gapBuffer.cursorBack();
        assert.strictEqual(gapBuffer.cursorPosition(), 4);
        gapBuffer.cursorBack();
        assert.strictEqual(gapBuffer.cursorPosition(), 3);

        gapBuffer.cursorBack();
        gapBuffer.cursorBack();
        gapBuffer.cursorBack();
        assert.strictEqual(gapBuffer.cursorPosition(), 0);

        gapBuffer.cursorBack();
        assert.strictEqual(gapBuffer.cursorPosition(), 0);
    },

    function GapBuffer_cursorPeek() {
        var gapBuffer = new GapBuffer('Hello');

        assert.strictEqual(gapBuffer.cursorCurrent(), 'H', 0);
        assert.strictEqual(gapBuffer.cursorForward().value, 'e', 1);
        assert.strictEqual(gapBuffer.cursorPeek(), 'l', 2);
    },

    function GapBuffer_cursorStart() {
        var gapBuffer = new GapBuffer('Hello');

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.cursorStart(), 'H');
    },

    function GapBuffer_cursorEnd() {
        var gapBuffer = new GapBuffer('Hello');

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.cursorEnd(), 'o');
    },

    function GapBuffer_cursorUp() {
        assert.fail("not yet implemented.");
    },

    function GapBuffer_cursorDown() {
        assert.fail("not yet implemented.");
    },

    function GapBuffer_findForward() {
        var gapBuffer = new GapBuffer('Hello, \nworld');

        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.findForward('H'), -1, "H");
        assert.strictEqual(gapBuffer.findForward('e'), 0, "e");
        assert.strictEqual(gapBuffer.findForward('l'), 1, "l");
        assert.strictEqual(gapBuffer.findForward('o'), 3, "o");
    },

    function GapBuffer_indexOf() {
        var gapBuffer = new GapBuffer('Hello, \nworld');

        assert.strictEqual(gapBuffer.indexOf('\n'), 7, "\\n");
        assert.strictEqual(gapBuffer.indexOf('w', 1), 7, "w, 1");

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.indexOf('w', 1), 7, "w, 1 (cursor+3)");
        assert.strictEqual(gapBuffer.indexOf('e', 6), -1, "e, 6 (cursor+3)");
        assert.strictEqual(gapBuffer.indexOf('f'), -1, "f (cursor+3)");
        assert.strictEqual(gapBuffer.indexOf('e', 1), 0, "e (cursor+3)");
    },

    function GapBuffer_findBack() {
        var gapBuffer = new GapBuffer('Hello');

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.findBack('H'), 3, "H");
        assert.strictEqual(gapBuffer.findBack('e'), 2, "e");
        assert.strictEqual(gapBuffer.findBack('l'), 0, "l");
        assert.strictEqual(gapBuffer.findBack('o'), -1, "o");
    },

    function GapBuffer_load() {
        var gapBuffer = new GapBuffer('Hello');

        assert.strictEqual(gapBuffer.toString(), 'Hello');

        gapBuffer.load('World');

        assert.strictEqual(gapBuffer.toString(), 'World');
    },

    function GapBuffer_toString() {
        var text = 'Hello, world',
            gapBuffer = new GapBuffer(text);

        assert.strictEqual(gapBuffer.toString(), text);
    },

    function GapBuffer_charAt() {
        var text = 'Hello',
            gapBuffer = new GapBuffer(text),
            index;

        assert.strictEqual(gapBuffer.charAt(-1), null, "at start: " + -1);
        assert.strictEqual(gapBuffer.charAt(text.length), null, "at start: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.charAt(index), text[index], "at start: " + index);
        }

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.charAt(-1), null, "moved 3: " + -1);
        assert.strictEqual(gapBuffer.charAt(text.length), null, "moved 3: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.charAt(index), text[index], "moved 3: " + index);
        }

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.charAt(-1), null, "at end: " + -1);
        assert.strictEqual(gapBuffer.charAt(text.length), null, "at end: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.charAt(index), text[index], "at end: " + index);
        }
    },

    function GapBuffer_length() {
        var gapBuffer = new GapBuffer();

        gapBuffer.load('Hello');
        assert.strictEqual(gapBuffer.length, 5);

        gapBuffer.load('Hello, world');
        assert.strictEqual(gapBuffer.length, 12);
    },

];
