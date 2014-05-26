/*jslint node: true */
'use strict';

var assert      = require('assert'),
    Writer      = require('../writer').Writer,
    GapBuffer   = require('../gap-buffer').GapBuffer;

exports.tests = [
    function Writer_write() {
        var changeXToT, history, writer, gapBuffer;

        gapBuffer = new GapBuffer('x');

        writer = new Writer(gapBuffer);

        changeXToT = [
            { cut:      1   },
            { insert:   't' },
            { back:     1   },
        ];

        history = [
            [
                { cut:      1,      undo: {     insert:     'x' } },
                { insert:   't',    undo: {     cut:        1   } },
                { back:     1,      undo: {     forward:    1   } },
            ]
        ];

        writer.write(changeXToT);

        assert.strictEqual(gapBuffer.toString(), 't');
        assert.deepEqual(writer.history, history);
        assert.deepEqual(writer.future, []);
    },

    function Writer_undo() {
        var changeXToT, history, future, writer, gapBuffer;

        gapBuffer = new GapBuffer('x');

        writer = new Writer(gapBuffer);

        changeXToT = [
            { cut:      1   },
            { insert:   't' },
            { back:     1   },
        ];

        history = [
            [
                { cut:      1,      undo: {     insert:     'x' } },
                { insert:   't',    undo: {     cut:        1   } },
                { back:     1,      undo: {     forward:    1   } },
            ]
        ];

        writer.write(changeXToT);
        writer.undo();

        assert.strictEqual(gapBuffer.toString(), 'x');
        assert.deepEqual(writer.history, []);
        assert.deepEqual(writer.future, history);
    },

    function Writer_redo() {
        var changeXToT, history, future, writer, gapBuffer;

        gapBuffer = new GapBuffer('x');

        writer = new Writer(gapBuffer);

        changeXToT = [
            { cut:      1   },
            { insert:   't' },
            { back:     1   },
        ];

        future = [
            [
                { cut:      1,      undo: {     insert:     'x' } },
                { insert:   't',    undo: {     cut:        1   } },
                { back:     1,      undo: {     forward:    1   } },
            ]
        ];

        writer.write(changeXToT);
        writer.undo();
        writer.redo();

        assert.strictEqual(gapBuffer.toString(), 't');
        assert.deepEqual(writer.history, history);
        assert.deepEqual(writer.future, []);
    },
];
