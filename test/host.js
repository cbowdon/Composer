/*jslint node: true */
'use strict';

var assert = require('assert'),
    Interpreter = require('../interpreter').Interpreter,
    Controller = require('../controller').Controller;

(function host() {

    var controller  = new Controller(),
        interpreter = new Interpreter(controller),

        enterInsertMode = interpreter.input('i'),

        bufferChanges = interpreter.sequence(['H', 'e', 'l', 'l', 'o']),

        exitInsertMode = interpreter.input('<ESC>');

    assert.deepEqual(enterInsertMode, {
        cursor: { row: 0, col: 0 },
        mode: 'insert',
    });

    assert.deepEqual(bufferChanges, {
        cursor: { row: 0, col: 4 },
        mode: 'insert',
        updates: [{
            index: { row: 0, col: 0 },
            length: 5,
            newValues: ['h', 'e', 'l', 'l', 'o'],
        }],
    });

    assert.deepEqual(bufferChanges, {
        cursor: { row: 0, col: 4 },
        mode: 'normal',
    });

    assert.deepEqual(controller.currentBuffer.state,
        [['H', 'e', 'l', 'l', 'o']]);

}());
