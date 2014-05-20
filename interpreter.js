/*jslint node: true */
'use strict';

var InsertInterpreter = require('./insert-interpreter').InsertInterpreter,
    NormalInterpreter   = require('./normal-interpreter').NormalInterpreter;

exports.Interpreter = (function InterpreterClosure() {
    function Interpreter(buffer) {

        this.buffer = buffer;

        this.interpreters = {
            '<Esc>': {
                name: 'normal',
                value: new NormalInterpreter(buffer),
            },
            'i': {
                name: 'insert',
                value: new InsertInterpreter(buffer),
            },
        };

        this.active = this.interpreters['<Esc>'];
    }

    Interpreter.prototype.input = function (key) {
        var terps = this.interpreters;

        if (terps.hasOwnProperty(key) && terps[key] !== this.active) {
            this.active = terps[key];
        } else {
            this.active.value.input(key);
        }
    };

    return Interpreter;
}());
