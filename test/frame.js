/*jslint node: true */
'use strict';

var assert  = require('assert'),
    Buffer  = require('../buffer').Buffer,
    Frame   = require('../frame').Frame;

exports.tests = [
    function Frame_next() {
        var buffer  = new Buffer('Hello, world'),
            frame   = new Frame(buffer, 10, 40);

        assert.strictEqual(frame.next().value, 'e');
        assert.strictEqual(frame.next().value, 'l');
        assert.strictEqual(frame.next().value, 'l');
        assert.strictEqual(frame.next().value, 'o');
        assert.ok(frame.next().done);

    },

    function Frame_tab() {
        var text    = '\tThis should be indented.',
            buffer  = new Buffer(text),
            frame   = new Frame(buffer, 10, 40),
            index = 0;

        while (index < 4) {
            assert.strictEqual(frame.next().value, ' ');
            index += 1;
        }

        while (index < text.length) {
            assert.strictEqual(frame.next().value, text[index - 4]);
            index += 1;
        }
    },

    function Frame_newLine() {
        var text    = 'This should split onto \nmultiple lines.',
            buffer  = new Buffer(text),
            frame   = new Frame(buffer, 10, 40),
            index = 0;

        while (text[index] !== '\n') {
            assert.strictEqual(frame.next().value, text[index]);
            index += 1;
        }

        while (index < 40) {
            assert.strictEqual(frame.next().value, ' ');
            index += 1;
        }
    }
];
