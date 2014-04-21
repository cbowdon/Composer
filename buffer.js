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

    Buffer.prototype = GapBuffer.prototype;
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
        return reverseIndex(this.after, character);
    };

    Buffer.prototype.findBack = function (character) {
        var index;
        if (this.cursorCurrent() === character) {
            return 0;
        }
        index = reverseIndex(this.before, character);
        return index === -1 ? index : index + 1;
    };

    Buffer.prototype.cursorCurrent = function () {
        return this.after[this.after.length - 1];
    };


    Buffer.prototype.cursorPeek = function () {
        return this.after[this.after.length - 2];
    };

    Buffer.prototype.cursorStart = function () {
        while (this.before.length > 0) {
            this.cursorBack();
        }
        return this.cursorCurrent();
    };

    Buffer.prototype.cursorEnd = function () {
        while (this.after.length > 1) {
            this.cursorForward();
        }
        return this.cursorCurrent();
    };

    Buffer.prototype.cursorUp = function () {

    };

    Buffer.prototype.cursorDown = function () {

    };

    return Buffer;

}());
