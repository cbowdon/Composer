/*jslint node: true */
'use strict';

var assert = require('assert'),
    Writer = require('../writer').Writer;

exports.tests = [
    function Writer_write() {
        var writer = new Writer('x');

        // simulating an update
        writer.write([
            { forward: 1 },
            { cut: 1 },
            { insert: 't' },
            { back: 1 },
        ]);

        assert.strictEqual(writer.gapBuffer.toString(), 't');

        writer.write([ { update: 'k' } ]);

        assert.strictEqual(writer.gapBuffer.toString(), 'k');

        writer.write([
            { forward: 1 },
            { insert: 'ing' },
            { back: 3 },
        ]);

        assert.strictEqual(writer.gapBuffer.toString(), 'king');
    },

    function Writer_undo() {
        var writer = new Writer('x');

        writer.write([
            { forward: 1 },
            { cut: 1 },
            { insert: 't' },
            { back: 1 },
        ]);

        writer.undo();

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
        var writer = new Writer('x'), i;

        writer.write([
            { forward: 1 },
            { cut: 1 },
            { insert: 't' },
            { back: 1 },
        ]);
        assert.strictEqual(writer.gapBuffer.toString(), 't');

        for (i = 0; i < 5; i += 1) {
            writer.undo();
            assert.strictEqual(writer.gapBuffer.toString(), 'x', i);

            writer.redo();
            assert.strictEqual(writer.gapBuffer.toString(), 't', i);
        }

        writer.write([
            { forward: 1 },
            { cut: 1 },
        ]);
        writer.write([
            { insert: 'k' },
            { back: 1 },
        ]);

        assert.strictEqual(writer.gapBuffer.toString(), 'k', 'Write double');

        writer.undo();
        writer.undo();
        assert.strictEqual(writer.gapBuffer.toString(), 't', 'Undo double');

        writer.redo();
        writer.redo();
        assert.strictEqual(writer.gapBuffer.toString(), 'k', 'Redo double');

        writer.redo();
        assert.strictEqual(writer.gapBuffer.toString(), 'k', 'Nothing to redo');
    },

    function Writer_rollback() {
        var text = 'test',
            writer = new Writer(text);

        writer.write([
            { forward: 1 },
            { insert: 'x' },
            { cut: 5 }
        ]);

        assert.strictEqual(writer.gapBuffer.toString(), text, 'No change on error');
    },
];
