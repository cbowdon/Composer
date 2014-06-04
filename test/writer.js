/*jslint node: true */
'use strict';

var assert = require('assert'),
    Writer = require('../writer').Writer;

exports.tests = [
    function Writer_write() {
        var writer = new Writer('x');

        writer.write([
            { forward: 1 },
            { cut: 1 },
            { insert: 't' },
            { back: 1 },
        ]);

        assert.strictEqual(writer.gapBuffer.toString(), 't');

        writer.write([
            { forward: 3 },
            { insert: 'ing' },
            { back: 3 },
        ]);

        assert.strictEqual(writer.gapBuffer.toString(), 'ting');
    },

    function Writer_undo() {
        var writer = new Writer('x');

        console.log('###########################');
        writer.write([
            { cut: 1 },
            { insert: 't' },
            { back: 1 },
        ]);
        console.log('###########################');

        writer.undo();
        console.log('###########################');

        assert.strictEqual(writer.gapBuffer.toString(), 'x', 'Basic undo');

        writer.write([
            { forward: 1 },
            { insert: 'ing' },
            { back: 3 },
        ]);

        writer.undo();

        assert.strictEqual(writer.gapBuffer.toString(), 'x', 'New undo');

        writer.write([
            { insert: 'fo' },
            { back: 2 },
        ]);

        writer.write([ { insert: 'fire' } ]);

        writer.undo();

        assert.strictEqual(writer.gapBuffer.toString(), 'fox', 'Undo single');

        writer.undo();

        assert.strictEqual(writer.gapBuffer.toString(), 'x', 'Undo multiple');

        writer.undo();

        assert.strictEqual(writer.gapBuffer.toString(), 'x', 'Nothing to undo');
    },

    function Writer_redo() {
        var writer = new Writer('x');

        writer.write([
            { cut:      1   },
            { insert:   't' },
            { back:     1   },
        ]);

        writer.undo();
        writer.redo();

        assert.strictEqual(writer.gapBuffer.toString(), 't');
    },
];
