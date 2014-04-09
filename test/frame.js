/*jslint node: true */
'use strict';

var assert  = require('assert'),
    Buffer  = require('../buffer').Buffer,
    Frame   = require('../frame').Frame;

exports.tests = [
    function Frame_next() {
        var buffer  = new Buffer('Hello, world'),
            frame   = new Frame(1, 4).frame(buffer, 1);

        assert.strictEqual(frame.next().value, 'e');
        assert.strictEqual(frame.next().value, 'l');
        assert.strictEqual(frame.next().value, 'l');
        assert.strictEqual(frame.next().value, 'o');
        assert.ok(frame.next().done);

    },

    function Frame_tab() {
        var text    = '\tThis should be indented.',
            buffer  = new Buffer(text),
            frame   = new Frame(2, 40).frame(buffer),
            index = 0;

        while (index < 4) {
            assert.strictEqual(frame.next().value, ' ', index + ' - tabs');
            index += 1;
        }

        while (index < text.length + 3) {
            assert.strictEqual(frame.next().value, text[index - 3], index + ' - chars');
            index += 1;
        }

        while (index < 80) {
            assert.ok(frame.next().done, index);
            index += 1;
        }
    },

    function Frame_newLine() {
        var text    = 'This should split onto \nmultiple lines.',
            buffer  = new Buffer(text),
            frame   = new Frame(2, 40).frame(buffer),
            index = 0,
            newLineIndex;

        while (text[index] !== '\n') {
            assert.strictEqual(frame.next().value, text[index], index + ' line 1 text');
            index += 1;
        }

        newLineIndex = index;

        while (index < 40) {
            assert.strictEqual(frame.next().value, ' ', index + ' - line 1 spaces');
            index += 1;
        }

        while (index < 40 + text.length - newLineIndex) {
            assert.strictEqual(frame.next().value, text[index - newLineIndex], index + ' - line 2 text');
            index += 1;
        }

        while (index < 80) {
            assert.ok(frame.next().done, index);
            index += 1;
        }
    }
];
