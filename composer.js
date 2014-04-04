/*jslint node: true */
'use strict';

var Buffer      = require('./buffer').Buffer,
    Interpreter = require('./interpreter').Interpreter;


module.exports.Composer = (function ComposerClosure() {

    function Composer() {
        this.buffer = new Buffer();
        this.interpreter = new Interpreter(this.buffer);
    }

    Composer.prototype.input = function (key) {
        this.interpreter.input(key);
    };

    Composer.prototype.addEventListener = function (name, listener) {
        this.buffer.addEventListener(name, listener);
    };

    return Composer;
}());
