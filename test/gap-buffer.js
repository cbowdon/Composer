/*jslint node: true */
/*globals describe, it */
'use strict';

var assert      = require('assert'),
    GapBuffer   = require('../gap-buffer').GapBuffer;

exports.tests = [

    function GapBuffer_insert() {
        var gapBuffer = new GapBuffer(", world");

        assert.strictEqual(gapBuffer.read(), ", world");

        gapBuffer
            .insert('H')
            .insert('e')
            .insert('l')
            .insert('l')
            .insert('o');

        assert.strictEqual(gapBuffer.read(), "Hello, world");
    },

    function GapBuffer_update() {
        var gapBuffer = new GapBuffer("Hello, world");

        gapBuffer.cursorForward();
        gapBuffer.update("u");

        assert.strictEqual(gapBuffer.cursorCurrent(), "u");
        assert.strictEqual(gapBuffer.read(), "Hullo, world");
    },

    function GapBuffer_delete() {
        var gapBuffer = new GapBuffer("Hello, world");

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.cut(), "l");
        assert.strictEqual(gapBuffer.read(), "Helo, world");
    },

    function GapBuffer_read() {
        var gapBuffer = new GapBuffer("Hello, world");

        assert.strictEqual(gapBuffer.read(), "Hello, world");
    },

    function GapBuffer_cursor() {
        var gapBuffer = new GapBuffer("Hello");

        assert.strictEqual(gapBuffer.cursorCurrent(), "H", 0);
        assert.strictEqual(gapBuffer.cursorBack(), "H", 1);
        assert.strictEqual(gapBuffer.cursorForward(), "e", 2);
        assert.strictEqual(gapBuffer.cursorForward(), "l", 3);
        assert.strictEqual(gapBuffer.cursorBack(), "e", 4);
        assert.strictEqual(gapBuffer.cursorForward(), "l", 5);
        assert.strictEqual(gapBuffer.cursorForward(), "l", 6);
        assert.strictEqual(gapBuffer.cursorForward(), "o", 7);
        assert.strictEqual(gapBuffer.cursorForward(), "o", 8);
        assert.strictEqual(gapBuffer.cursorBack(), "l", 9);
    },

    function GapBuffer_cursorPeek() {
        var gapBuffer = new GapBuffer("Hello");

        assert.strictEqual(gapBuffer.cursorCurrent(), "H", 0);
        assert.strictEqual(gapBuffer.cursorForward(), "e", 1);
        assert.strictEqual(gapBuffer.cursorPeek(), "l", 2);
    },

    function GapBuffer_cursorStart() {
        var gapBuffer = new GapBuffer("Hello");

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.cursorStart(), "H");
    },

    function GapBuffer_cursorEnd() {
        var gapBuffer = new GapBuffer("Hello");

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.cursorEnd(), "o");
    },

    function GapBuffer_findForward() {
        var gapBuffer = new GapBuffer("Hello");

        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.findForward('H'), -1, "H");
        assert.strictEqual(gapBuffer.findForward('e'), 0, "e");
        assert.strictEqual(gapBuffer.findForward('l'), 1, "l");
        assert.strictEqual(gapBuffer.findForward('o'), 3, "o");
    },

    function GapBuffer_findBack() {
        var gapBuffer = new GapBuffer("Hello");

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.findBack('H'), 3, "H");
        assert.strictEqual(gapBuffer.findBack('e'), 2, "e");
        assert.strictEqual(gapBuffer.findBack('l'), 0, "l");
        assert.strictEqual(gapBuffer.findBack('o'), -1, "o");
    },
];
