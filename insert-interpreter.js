/*jslint node: true */
'use strict';

module.exports.InsertInterpreter = (function InsertInterpreterClosure() {

    function InsertInterpreter(buffer) {
        this.buffer = buffer;
    }

    InsertInterpreter.prototype.input = function (character) {
        if (character.length === 1) {
            this.buffer.text.insert(character);
        }
    };

    return InsertInterpreter;
}());
