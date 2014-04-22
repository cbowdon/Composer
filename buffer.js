/*jslint node: true */
'use strict';

var GapBuffer = require('./gap-buffer').GapBuffer;

module.exports.Buffer = (function BufferClosure() {

    function reverseIndex(array, value) {
        var i, len = array.length;
        for (i = len - 1; i >= 0; i -= 1) {
            if (array[i] === value) {
                return len - 1 - i;
            }
        }
        return -1;
    }

    function Buffer(text) {
        GapBuffer.call(this, text);
    }

    Buffer.prototype.constructor = Buffer;

    Buffer.prototype.indexOf = function (character, fromIndex) {
        var offset = fromIndex || 0,
            i;

        for (i = offset; i < this.length; i += 1) {
            if (this.charAt(i) === character) {
                return i;
            }
        }

        return -1;
    };

    Buffer.prototype.lastIndexOf = function (character, fromIndex) {
        var offset = fromIndex || this.length - 1,
            i;

        for (i = offset; i > 0; i -= 1) {
            if (this.charAt(i) === character) {
                return i;
            }
        }

        return -1;
    };

    Buffer.prototype.findForward = function (character) {
        var index = this.indexOf(character, this.cursorPosition());

        return index === -1 ? index : index - this.cursorPosition();
    };

    Buffer.prototype.findBack = function (character) {
        var index = this.lastIndexOf(character, this.cursorPosition());

        console.log({ index: index, cursor: this.cursorPosition() });
        return index === -1 ? index : this.cursorPosition() - index;
    };

    Buffer.prototype.cursorPeek = function () {
        return this.charAt(this.cursorPosition() + 1);
    };

    Buffer.prototype.cursorStart = function () {
        var result;

        do {
            result = this.cursorBack();
        } while (!result.done);

        return this.cursorCurrent();
    };

    Buffer.prototype.cursorEnd = function () {
        var result;

        do {
            result = this.cursorForward();
        } while (!result.done);

        return this.cursorCurrent();
    };

    Buffer.prototype.cursorUp = function () {

    };

    Buffer.prototype.cursorDown = function () {

    };

    return Buffer;

}());
