/*jslint node: true */
'use strict';

var InsertInterpreter = require('./insert-interpreter').InsertInterpreter;

module.exports.Interpreter = (function InterpreterClosure() {
    function Interpreter(buffer) {
        this.buffer = buffer;
        this.insert = new InsertInterpreter(buffer);
    }

    Interpreter.prototype.input = function (character) {
        // Currently only insert mode is supported
        return this.insert.input(character);
    };

    return Interpreter;
}());
