/*jslint node: true */
'use strict';

var assert = require('assert'),
    Interpreter = require('../interpreter').Interpreter,
    Controller = require('../controller').Controller;

(function host() {

    var controller  = new Controller(),
        interpreter = new Interpreter(controller),

        // type iHello<ESC>
        bufferChanges = interpreter.input([
            { keyCode: 73 },
            { keyCode: 72, shiftKey: true },
            { keyCode: 69 },
            { keyCode: 76 },
            { keyCode: 76 },
            { keyCode: 79 },
            { keyCode: 219, ctrlKey: true }
        ]);

    assert.deepEqual(bufferChanges, {
        cursorPosition: { row: 0, col: 4 },
        updates: [{
            index: { row: 0, col: 0 },
            length: 5,
            newValues: ['h', 'e', 'l', 'l', 'o'],
        }],
    });

    assert.deepEqual(controller.currentBuffer.state,
        [['h', 'e', 'l', 'l', 'o']]);

}());
