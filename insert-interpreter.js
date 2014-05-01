/*jslint node: true */
'use strict';

exports.InsertInterpreter = (function InsertInterpreterClosure() {
    var base = require('./lib-base');

    function InsertInterpreter(buffer) {
        this.buffer = buffer;
    }

    InsertInterpreter.prototype.input = function (character) {
        if (character.length === 1) {
            return this.buffer.insert(character);
        }
        if (character === '<CR>') {
            return this.buffer.insert('\n');
        }
        if (character === '<Tab>') {
            return this.insertTab();
        }
        if (character === '<Del>') {
            return this.buffer.cut();
        }
        if (character === '<Backspace>') {
            this.buffer.cursorBack();
            return this.buffer.cut();
        }
        if (character === '<Left>') {
            return this.buffer.cursorBack();
        }
        if (character === '<Right>') {
            return this.buffer.cursorForward();
        }
        if (character === '<Up>') {
            return this.buffer.cursorUp();
        }
        if (character === '<Down>') {
            return this.buffer.cursorDown();
        }
        if (character === '<C-e>') {
            return base.cursorEOL(this.buffer);
        }
        if (character === '<C-a>') {
            return base.cursorBOL(this.buffer);
        }
    };

    InsertInterpreter.prototype.insertTab = function () {
        this.buffer.insert(' ');
        this.buffer.insert(' ');
        this.buffer.insert(' ');
        this.buffer.insert(' ');
        return this;
    };

    return InsertInterpreter;
}());
