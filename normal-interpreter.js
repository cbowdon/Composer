/*jslint node: true */
'use strict';

exports.NormalInterpreter = (function NormalInterpreterClosure() {
    function NormalInterpreter(buffer) {
        this.buffer = buffer;
    }

    NormalInterpreter.prototype.input = function (character) {
        console.log('normal mode!', character);
    };

    return NormalInterpreter;
}());
