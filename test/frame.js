/*jslint node: true */
'use strict';

var assert  = require('assert'),
    Buffer  = require('../buffer').Buffer,
    Framer   = require('../frame').Framer;

// Check that all properties in expected are the same as in actual,
// ignoring properties in actual that are not in expected
function assertPartEqual(actual, expected, msg) {
    var prop;
    for (prop in expected) {
        if (expected.hasOwnProperty(prop) && expected[prop] !== actual[prop]) {
            assert.fail(actual, expected, msg, '===');
        }
    }
}

exports.tests = [
    function Framer_next() {
        var buffer  = new Buffer('Hello, world'),
            frame   = new Framer(1, 4).frame(buffer, 1);

        assertPartEqual(frame.next(), { value: 'e', done: false });
        assertPartEqual(frame.next(), { value: 'l', done: false });
        assertPartEqual(frame.next(), { value: 'l', done: false });
        assertPartEqual(frame.next(), { value: 'o', done: false });
        assertPartEqual(frame.next(), { done: true });
    },

    function Framer_nowrap() {
        var buffer  = new Buffer('Hello, \nworld'),
            frame   = new Framer(2, 3).frame(buffer);

        assertPartEqual(frame.next(), { value: 'H', done: false });
        assertPartEqual(frame.next(), { value: 'e', done: false });
        assertPartEqual(frame.next(), { value: 'l', done: false });

        assertPartEqual(frame.next(), { value: 'w', done: false });
        assertPartEqual(frame.next(), { value: 'o', done: false });
        assertPartEqual(frame.next(), { value: 'r', done: false });

        assertPartEqual(frame.next(), { done: true });
    },

    function Framer_tab() {
        var text    = '\tIndent!',
            buffer  = new Buffer(text),
            frame   = new Framer(2, 40).frame(buffer);

        assertPartEqual(frame.next(), { value: ' ', done: false });
        assertPartEqual(frame.next(), { value: ' ', done: false });
        assertPartEqual(frame.next(), { value: ' ', done: false });
        assertPartEqual(frame.next(), { value: ' ', done: false });
        assertPartEqual(frame.next(), { value: 'I', done: false });
        assertPartEqual(frame.next(), { value: 'n', done: false });
        assertPartEqual(frame.next(), { value: 'd', done: false });
        assertPartEqual(frame.next(), { value: 'e', done: false });
        assertPartEqual(frame.next(), { value: 'n', done: false });
        assertPartEqual(frame.next(), { value: 't', done: false });
        assertPartEqual(frame.next(), { value: '!', done: false });
        assertPartEqual(frame.next(), { done: true });
    },

    function Framer_newLine() {
        var text    = 'Split \nthis.',
            buffer  = new Buffer(text),
            frame   = new Framer(2, 10).frame(buffer);

        assertPartEqual(frame.next(), { value: 'S', done: false });
        assertPartEqual(frame.next(), { value: 'p', done: false });
        assertPartEqual(frame.next(), { value: 'l', done: false });
        assertPartEqual(frame.next(), { value: 'i', done: false });
        assertPartEqual(frame.next(), { value: 't', done: false });
        assertPartEqual(frame.next(), { value: ' ', done: false });
        assertPartEqual(frame.next(), { value: undefined, done: false });
        assertPartEqual(frame.next(), { value: undefined, done: false });
        assertPartEqual(frame.next(), { value: undefined, done: false });
        assertPartEqual(frame.next(), { value: undefined, done: false });

        assertPartEqual(frame.next(), { value: 't', done: false });
        assertPartEqual(frame.next(), { value: 'h', done: false });
        assertPartEqual(frame.next(), { value: 'i', done: false });
        assertPartEqual(frame.next(), { value: 's', done: false });
        assertPartEqual(frame.next(), { value: '.', done: false });
        assertPartEqual(frame.next(), { done: true });
        assertPartEqual(frame.next(), { done: true });
        assertPartEqual(frame.next(), { done: true });
        assertPartEqual(frame.next(), { done: true });
        assertPartEqual(frame.next(), { done: true });
    },

    function Framer_cursor() {
        var text    = 'Some text.',
            buffer  = new Buffer(text),
            framer  = new Framer(10, 10);

        function assertCursorAt(index, msg) {
            var frame   = framer.frame(buffer),
                result  = frame.next(),
                count   = 0,
                test;

            while (!result.done) {
                test = count === index ? result.cursor : !result.cursor;
                assert.ok(test, msg || { index: index, count: count });
                count += 1;
                result = frame.next();
            }
        }

        assertCursorAt(0);

        buffer.cursorForward();
        assertCursorAt(1);

        buffer.cursorForward();
        buffer.cursorForward();
        buffer.cursorForward();
        buffer.cursorBack();
        assertCursorAt(3);

        buffer.cursorEnd();
        assertCursorAt(text.length);

        buffer.cursorStart();
        assertCursorAt(0);
    },
];
