/*jslint node: true */
'use strict';

var assert  = require('assert'),
    Buffer  = require('../buffer').Buffer,
    Framer   = require('../frame').Framer;

exports.tests = [
    function Framer_next() {
        var buffer  = new Buffer('Hello, world'),
            frame   = new Framer(1, 4).frame(buffer, 1);

        assert.deepEqual(frame.next(), { value: 'e', done: false });
        assert.deepEqual(frame.next(), { value: 'l', done: false });
        assert.deepEqual(frame.next(), { value: 'l', done: false });
        assert.deepEqual(frame.next(), { value: 'o', done: false });
        assert.deepEqual(frame.next(), { done: true });
    },

    function Framer_tab() {
        var text    = '\tIndent!',
            buffer  = new Buffer(text),
            frame   = new Framer(2, 40).frame(buffer);

        assert.deepEqual(frame.next(), { value: ' ', done: false });
        assert.deepEqual(frame.next(), { value: ' ', done: false });
        assert.deepEqual(frame.next(), { value: ' ', done: false });
        assert.deepEqual(frame.next(), { value: ' ', done: false });
        assert.deepEqual(frame.next(), { value: 'I', done: false });
        assert.deepEqual(frame.next(), { value: 'n', done: false });
        assert.deepEqual(frame.next(), { value: 'd', done: false });
        assert.deepEqual(frame.next(), { value: 'e', done: false });
        assert.deepEqual(frame.next(), { value: 'n', done: false });
        assert.deepEqual(frame.next(), { value: 't', done: false });
        assert.deepEqual(frame.next(), { value: '!', done: false });
        assert.deepEqual(frame.next(), { done: true });
    },

    function Framer_newLine() {
        var text    = 'Split \nthis.',
            buffer  = new Buffer(text),
            frame   = new Framer(2, 10).frame(buffer);

        assert.deepEqual(frame.next(), { value: 'S', done: false });
        assert.deepEqual(frame.next(), { value: 'p', done: false });
        assert.deepEqual(frame.next(), { value: 'l', done: false });
        assert.deepEqual(frame.next(), { value: 'i', done: false });
        assert.deepEqual(frame.next(), { value: 't', done: false });
        assert.deepEqual(frame.next(), { value: ' ', done: false });
        assert.deepEqual(frame.next(), { value: undefined, done: false });
        assert.deepEqual(frame.next(), { value: undefined, done: false });
        assert.deepEqual(frame.next(), { value: undefined, done: false });
        assert.deepEqual(frame.next(), { value: undefined, done: false });
        assert.deepEqual(frame.next(), { value: 't', done: false });
        assert.deepEqual(frame.next(), { value: 'h', done: false });
        assert.deepEqual(frame.next(), { value: 'i', done: false });
        assert.deepEqual(frame.next(), { value: 's', done: false });
        assert.deepEqual(frame.next(), { value: '.', done: false });
        assert.deepEqual(frame.next(), { done: true });
        assert.deepEqual(frame.next(), { done: true });
        assert.deepEqual(frame.next(), { done: true });
        assert.deepEqual(frame.next(), { done: true });
        assert.deepEqual(frame.next(), { done: true });
    }
];
