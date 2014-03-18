/*jslint node: true */
'use strict';

var assert      = require('assert'),
    GapBuffer   = require('../gap-buffer').GapBuffer;

exports.tests = [
    function GapBuffer_insert() {
        var gapBuffer = new GapBuffer();

        assert.strictEqual(gapBuffer.read(), "");

        gapBuffer.insert('H');
        gapBuffer.insert('e');
        gapBuffer.insert('l');
        gapBuffer.insert('l');
        gapBuffer.insert('o');

        assert.strictEqual(gapBuffer.read(), "Hello");
    },
    function GapBuffer_update() {
        assert.fail();
    },
    function GapBuffer_delete() {
        assert.fail();
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
];
