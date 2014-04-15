/*jslint node: true */
/*globals describe, it */
'use strict';

var assert      = require('assert'),
    GapBuffer   = require('../gap-buffer').GapBuffer;

exports.tests = [

    function GapBuffer_insert() {
        var gapBuffer = new GapBuffer(', world');

        assert.strictEqual(gapBuffer.read(), ', world');

        gapBuffer
            .insert('H')
            .insert('e')
            .insert('l')
            .insert('l')
            .insert('o');

        assert.strictEqual(gapBuffer.read(), 'Hello, world');
    },

    function GapBuffer_update() {
        var gapBuffer = new GapBuffer('Hello, world');

        gapBuffer.cursorForward();
        gapBuffer.update('u');

        assert.strictEqual(gapBuffer.cursorCurrent(), 'u');
        assert.strictEqual(gapBuffer.read(), 'Hullo, world');
    },

    function GapBuffer_delete() {
        var gapBuffer = new GapBuffer('Hello, world');

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.cut(), 'l');
        assert.strictEqual(gapBuffer.read(), 'Helo, world');
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

        assert.strictEqual(gapBuffer.findForward('\n', 2), 5, "\\n");
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

        assert.strictEqual(gapBuffer.read(), 'Hello');

        gapBuffer.load('World');

        assert.strictEqual(gapBuffer.read(), 'World');
    },

    function GapBuffer_read() {
        var text = 'Hello, world',
            gapBuffer = new GapBuffer(text);

        assert.strictEqual(gapBuffer.read(), text);
    },

    function GapBuffer_readAt() {
        var text = 'Hello',
            gapBuffer = new GapBuffer(text),
            index;

        assert.strictEqual(gapBuffer.readAt(-1), null, "at start: " + -1);
        assert.strictEqual(gapBuffer.readAt(text.length), null, "at start: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.readAt(index), text[index], "at start: " + index);
        }

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.readAt(-1), null, "moved 3: " + -1);
        assert.strictEqual(gapBuffer.readAt(text.length), null, "moved 3: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.readAt(index), text[index], "moved 3: " + index);
        }

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.readAt(-1), null, "at end: " + -1);
        assert.strictEqual(gapBuffer.readAt(text.length), null, "at end: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.readAt(index), text[index], "at end: " + index);
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
