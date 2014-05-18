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

        gapBuffer.insert(', hello');
        assert.strictEqual(gapBuffer.toString(), 'Hello, hello, world');

        gapBuffer.insert([',', ' ', 'h', 'e', 'l', 'l', 'o']);
        assert.strictEqual(gapBuffer.toString(), 'Hello, hello, hello, world');
    },

    function GapBuffer_update() {
        var gapBuffer = new GapBuffer('Hello, world');

        gapBuffer.cursorForward();
        gapBuffer.update('u');

        assert.deepEqual(gapBuffer.cursorCurrent(), { value: 'u', done: false });
        assert.strictEqual(gapBuffer.toString(), 'Hullo, world');
    },

    function GapBuffer_cut() {
        var gapBuffer = new GapBuffer('Hello, world');

        gapBuffer.cursorForward(3);

        assert.strictEqual(gapBuffer.cut(), 'l');
        assert.strictEqual(gapBuffer.toString(), 'Helo, world');
    },

    function GapBuffer_cursor() {
        var gapBuffer = new GapBuffer('Hello');

        assert.deepEqual(gapBuffer.cursorCurrent(), { value: 'H', done: false }, 0);
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

    function GapBuffer_index() {
        var gapBuffer = new GapBuffer('Hello');

        assert.strictEqual(gapBuffer.index, 0);

        gapBuffer.cursorForward();
        assert.strictEqual(gapBuffer.index, 1);
        gapBuffer.cursorForward(1);
        assert.strictEqual(gapBuffer.index, 2);

        gapBuffer.cursorForward(3);
        assert.strictEqual(gapBuffer.index, 5);

        gapBuffer.cursorForward();
        assert.strictEqual(gapBuffer.index, 5);

        gapBuffer.cursorBack();
        assert.strictEqual(gapBuffer.index, 4);
        gapBuffer.cursorBack();
        assert.strictEqual(gapBuffer.index, 3);

        gapBuffer.cursorBack(3);
        assert.strictEqual(gapBuffer.index, 0);

        gapBuffer.cursorBack();
        assert.strictEqual(gapBuffer.index, 0);
    },

    function GapBuffer_cursorRow() {
        var text = "Hello, \nworld!\nIs it me you're looking for?",
            gapBuffer = new GapBuffer(text);

        assert.strictEqual(gapBuffer.cursorRow(), 0, 'line 0');

        gapBuffer.cursorForward(7);
        assert.strictEqual(gapBuffer.cursorRow(), 0, 'line 0');

        gapBuffer.cursorForward(1);
        assert.strictEqual(gapBuffer.cursorRow(), 1, 'line 1');

        gapBuffer.cursorBack(1);
        assert.strictEqual(gapBuffer.cursorRow(), 0, 'line 0');

        gapBuffer.cursorForward(20);
        assert.strictEqual(gapBuffer.cursorRow(), 2, 'line 2');
    },

    function GapBuffer_cursorCol() {
        var text = "Hello, \nworld!\nIs it me you're looking for?",
            gapBuffer = new GapBuffer(text);

        assert.strictEqual(gapBuffer.cursorCol(), 0, 'line 0');

        gapBuffer.cursorForward(3);
        assert.strictEqual(gapBuffer.cursorCol(), 3, 'line 0');

        gapBuffer.cursorForward(4);
        assert.strictEqual(gapBuffer.cursorCol(), 7, 'line 0');

        gapBuffer.cursorForward(1);
        assert.strictEqual(gapBuffer.cursorCol(), 0, 'line 1');

        gapBuffer.cursorForward(7);
        assert.strictEqual(gapBuffer.cursorCol(), 0, 'line 1');

        gapBuffer.cursorBack(1);
        assert.strictEqual(gapBuffer.cursorCol(), 6, 'line 1');

        gapBuffer.cursorForward(29);
        assert.strictEqual(gapBuffer.cursorCol(), 28, 'line 2 (end of buffer)');
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

        assert.strictEqual(gapBuffer.charAt(-1), undefined, "at start: " + -1);
        assert.strictEqual(gapBuffer.charAt(text.length), undefined, "at start: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.charAt(index), text[index], "at start: " + index);
        }

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.charAt(-1), undefined, "moved 3: " + -1);
        assert.strictEqual(gapBuffer.charAt(text.length), undefined, "moved 3: " + text.length);

        for (index = 0; index < text.length; index += 1) {
            assert.strictEqual(gapBuffer.charAt(index), text[index], "moved 3: " + index);
        }

        gapBuffer.cursorForward();
        gapBuffer.cursorForward();
        gapBuffer.cursorForward();

        assert.strictEqual(gapBuffer.charAt(-1), undefined, "at end: " + -1);
        assert.strictEqual(gapBuffer.charAt(text.length), undefined, "at end: " + text.length);

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
