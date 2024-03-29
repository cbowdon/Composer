/*jslint node: true */
'use strict';

exports.InsertInterpreter = (function InsertInterpreterClosure() {

    function InsertInterpreter(buffer) {
        this.buffer = buffer;
        this.cursor = buffer.cursor;
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
            if (this.buffer.index === this.buffer.length) {
                return null;
            }
            this.cursor.right();
            return this.buffer.cut();
        }
        if (character === '<Backspace>') {
            if (this.buffer.index === 0) {
                return null;
            }
            return this.buffer.cut();
        }
        if (character === '<Left>') {
            return this.cursor.left();
        }
        if (character === '<Right>') {
            return this.cursor.right();
        }
        if (character === '<Up>') {
            return this.cursor.up();
        }
        if (character === '<Down>') {
            return this.cursor.down();
        }
        if (character === '<C-e>') {
            return this.cursor.endOfLine();
        }
        if (character === '<C-a>') {
            return this.cursor.startOfLine();
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
