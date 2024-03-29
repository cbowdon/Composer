/*jslint node: true */
'use strict';

var assert  = require('assert'),
    base    = require('../lib-base'),
    Buffer  = require('../buffer').Buffer,
    text    = "Hello, \nworld,\n is it me you're looking for?";

exports.tests = [
    function LibBase_lines_characters() {
        var buffer  = new Buffer(text),
            lines   = base.lines(buffer);

        assert.strictEqual(lines.length, 3);
        assert.strictEqual(lines[0].length, 8);
        assert.strictEqual(lines[1].length, 7);
        assert.strictEqual(lines[2].length, 30);

        function concat(acc, item) { return acc + (item.character || ''); }

        assert.strictEqual(lines[0].reduce(concat, ''), 'Hello, \n');

        assert.strictEqual(lines[1].reduce(concat, ''), 'world,\n');

        assert.strictEqual(lines[2].reduce(concat, ''), " is it me you're looking for?");
    },

    function LibBase_lines_cursor() {
        var buffer  = new Buffer(text),
            lines   = base.lines(buffer);

        assert.deepEqual(lines[0][0], {
            character: 'H',
            index: 0,
            cursor: true,
        });
        assert.deepEqual(lines[1][0], {
            character: 'w',
            index: 8,
            cursor: false,
        });

        buffer.cursor.end();
        lines = base.lines(buffer);

        assert.deepEqual(lines[2][29], {
            character: null,
            index: text.length,
            cursor: true,
        });
    },

];
