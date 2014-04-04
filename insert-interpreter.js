/*jslint node: true */
'use strict';

module.exports.InsertInterpreter = (function InsertInterpreterClosure() {

    function InsertInterpreter(buffer) {
        this.buffer = buffer;
    }

    InsertInterpreter.prototype.input = function (character) {
        if (character.length === 1) {
            this.buffer.insert(character);
        }
        if (character === '<CR>') {
          this.buffer.insert('\n');
        }
        if (character === '<Tab>') {
          this.insertTab();
        }
    };

    InsertInterpreter.prototype.insertTab = function () {
        this.buffer.insert(' ');
        this.buffer.insert(' ');
        this.buffer.insert(' ');
        this.buffer.insert(' ');
    };

    return InsertInterpreter;
}());
