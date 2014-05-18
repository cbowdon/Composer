/*jslint node: true */
'use strict';

var assert = require('assert'),
    Buffer = require('../buffer').Buffer;

exports.tests = [
    function Cursor_toIndex() {
        var buffer = new Buffer('Hello'),
            cursor = buffer.cursor;

        assert.strictEqual(cursor.toIndex(3).value, 'l');
        assert.strictEqual(buffer.index, 3);

        assert.strictEqual(cursor.toIndex(0).value, 'H');
        assert.strictEqual(buffer.index, 0);

        assert.strictEqual(cursor.toIndex(4).value, 'o');
        assert.strictEqual(buffer.index, 4);

        assert.strictEqual(cursor.toIndex(2).value, 'l');
        assert.strictEqual(buffer.index, 2);

        assert.strictEqual(cursor.toIndex(-1), undefined);
        assert.strictEqual(buffer.index, 2);

        assert.strictEqual(cursor.toIndex(6), undefined);
        assert.strictEqual(buffer.index, 2);

        assert.deepEqual(cursor.toIndex(5), { done: true });
        assert.strictEqual(buffer.index, 5);
    },

    function Cursor_start() {
        var buffer = new Buffer('Hello'),
            cursor = buffer.cursor;

        cursor.right(3);

        assert.deepEqual(cursor.start(), { value: 'H', done: false });
    },

    function Cursor_end() {
        var buffer = new Buffer('Hello'),
            cursor = buffer.cursor;

        cursor.right(3);

        assert.deepEqual(cursor.end(), { done: true });
    },

    function Cursor_down() {
        var text = 'Hello, \nworld.\n\nIs it me...',
            buffer = new Buffer(text),
            cursor = buffer.cursor;

        cursor.right();
        assert.deepEqual(cursor.current(), { value: 'e', done: false }, 'line 0 col 1');

        assert.deepEqual(cursor.down(), { done: false, value: 'o' }, 'line 1 col 1');
        assert.strictEqual(buffer.index, 9);

        assert.deepEqual(cursor.down(), { done: false, value: '\n' }, 'line 2 col 0');
        assert.strictEqual(buffer.index, 15);

        assert.deepEqual(cursor.down(), { done: false, value: 's' }, 'line 3 col 1');
        assert.strictEqual(buffer.index, 17);

        assert.deepEqual(cursor.down(), { done: false, value: 's' }, 'line 3 (no movement)');
        assert.strictEqual(buffer.index, 17);
    },

    function Cursor_up() {
        var text = 'Hello, \nworld.\n\nIs\n it me...',
            buffer = new Buffer(text),
            cursor = buffer.cursor;

        cursor.end();
        cursor.left(4);

        assert.deepEqual(cursor.current(), { value: 'e', done: false }, 'line 4 col 5');
        assert.deepEqual(cursor.up(), { value: '\n', done: false }, 'line 3 col 2');
        assert.deepEqual(cursor.up(), { value: '\n', done: false }, 'line 2 col 0');
        assert.deepEqual(cursor.up(), { value: '.', done: false }, 'line 1 col 5');
        assert.deepEqual(cursor.up(), { value: ',', done: false }, 'line 0 col 5');
        assert.deepEqual(cursor.up(), { value: ',', done: false }, 'line 0 (no movement)');
    },

    function Cursor_peek() {
        var buffer = new Buffer('Hello'),
            cursor  = buffer.cursor;

        assert.deepEqual(cursor.current(), { value: 'H', done: false }, 0);
        assert.strictEqual(cursor.right().value, 'e', 1);
        assert.strictEqual(cursor.peek(), 'l', 2);
    },

    function Cursor_to() {
        var text = "Hello, my baby,\nhello my honey,\nhello my ragtime gal\n",
            buffer = new Buffer(text),
            cursor = buffer.cursor;

        assert.strictEqual(cursor.to('\n').value, '\n', 'end of line 0');
        assert.strictEqual(buffer.index, text.indexOf('\n'), 'end of line 0');

        assert.strictEqual(cursor.to('h').value, 'h', 'line 1');
        assert.strictEqual(buffer.index, text.indexOf('h', 2), 'line 1');

        assert.strictEqual(cursor.to('\n').value, '\n', 'end of line 1');
        assert.strictEqual(buffer.index, text.indexOf('\n', 20), 'end of line 1');

        assert.strictEqual(cursor.to('\n').value, '\n', 'end of line 1 (no movement)');
        assert.strictEqual(buffer.index, text.indexOf('\n', 20), 'end of line 1 (no movement)');

        assert.strictEqual(cursor.to('z').value, '\n', 'end of line 1 (no movement)');
        assert.strictEqual(buffer.index, text.indexOf('\n', 20), 'end of line 1 (no movement)');

        cursor.right();

        assert.strictEqual(cursor.to('\n').value, '\n', 'end of line 2');
        assert.strictEqual(buffer.index, text.indexOf('\n', 40), 'end of line 2');
    },

    function Cursor_backTo() {
        var text = "Hello, my baby,\nhello my honey,\nhello my ragtime gal\n",
            buffer = new Buffer(text),
            cursor = buffer.cursor;

        cursor.end();

        assert.strictEqual(cursor.backTo('g').value, 'g', 'line 2');
        assert.strictEqual(buffer.index, text.lastIndexOf('g'), 'line 2');

        assert.strictEqual(cursor.backTo('\n').value, '\n', 'line 1');
        assert.strictEqual(buffer.index, text.lastIndexOf('\n', 40), 'line 1');

        cursor.left();
        assert.strictEqual(cursor.backTo('\n').value, '\n', 'line 0');
        assert.strictEqual(buffer.index, text.indexOf('\n'), 'line 0');

        cursor.left();
        assert.strictEqual(cursor.backTo('\n').value, ',', 'line 0 (no movement)');
        assert.strictEqual(buffer.index, text.indexOf(',', 10), 'line 0 (no movement)');
    },

];
