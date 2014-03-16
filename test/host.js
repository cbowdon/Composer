/*jslint node: true */
'use strict';

var assert = require('assert'),
    Interpreter = require('../interpreter').Interpreter,
    Controller = require('../controller').Controller;

(function host() {

    var controller  = new Controller(),
        interpreter = new Interpreter(controller),

        // i
        enterInsertMode = interpreter.input({ keyCode: 73 }),

        // type Hello
        bufferChanges = interpreter.input([
            { keyCode: 72, shiftKey: true },
            { keyCode: 69 },
            { keyCode: 76 },
            { keyCode: 76 },
            { keyCode: 79 },
        ]),

        // <C-[>
        exitInsertMode = interpreter.input({ keyCode: 219, ctrlKey: true });

    assert.deepEqual(enterInsertMode, {
        cursorPosition: { row: 0, col: 0 },
        mode: 'insert',
    });

    assert.deepEqual(bufferChanges, {
        cursorPosition: { row: 0, col: 4 },
        mode: 'insert',
        updates: [{
            index: { row: 0, col: 0 },
            length: 5,
            newValues: ['h', 'e', 'l', 'l', 'o'],
        }],
    });

    assert.deepEqual(bufferChanges, {
        cursorPosition: { row: 0, col: 4 },
        mode: 'normal',
    });

    assert.deepEqual(controller.currentBuffer.state,
        [['h', 'e', 'l', 'l', 'o']]);

}());
