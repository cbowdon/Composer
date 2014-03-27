/*jslint node: true */
'use strict';

var Buffer              = require('./buffer').BufferRouter,
    InsertInterpreter   = require('./insert-interpreter').InsertInterpreter;


module.exports.Composer = (function ComposerClosure() {

    function Composer() {
        this.buffer = new Buffer();
        this.insert = new InsertInterpreter(this.buffer);
    }

    Composer.prototype.input = function (key) {
        this.insert.input(key);
    };

    return Composer;
}());
