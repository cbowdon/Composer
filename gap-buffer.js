/*jslint node: true */
'use strict';

var publisher = require('./publisher');

module.exports.GapBuffer = (function GapBufferClosure() {

    function reverseIndex(array, value) {
        var i, len = array.length;
        for (i = len - 1; i >= 0; i -= 1) {
            if (array[i] === value) {
                return len - 1 - i;
            }
        }
        return -1;
    }

    function GapBuffer(text) {
        // Actually implemented as 2 stacks rather than the
        // traditional giant split buffer with pointers.
        // The 'after' stack is reversed,
        // for O(1) insertion at the front.
        this.before = [];
        this.after = [];

        if (text) {
            this.load(text);
        }
    }

    Object.defineProperties(GapBuffer.prototype, publisher);

    Object.defineProperty(GapBuffer.prototype, 'length', {
        get: function () {
            return this.before.length + this.after.length;
        }
    });

    GapBuffer.prototype.cursorPosition = function () {
        return this.before.length;
    };

    GapBuffer.prototype.cursorCurrent = function () {
        return this.after[this.after.length - 1];
    };

    GapBuffer.prototype.cursorForward = function () {
        // moves a char from after to before
        var movedChar = this.after.pop();

        if (movedChar) {
            this.before.push(movedChar);
        }

        if (this.after.length === 0) {
            return { done: true };
        }

        return { done: false, value: this.cursorCurrent() };
    };

    GapBuffer.prototype.cursorBack = function () {
        var movedChar = this.before.pop();

        if (movedChar) {
            this.after.push(movedChar);
        }

        if (this.before.length === 0) {
            return { done: true };
        }

        return { done: false, value: this.cursorCurrent() };
    };

    GapBuffer.prototype.cursorPeek = function () {
        return this.after[this.after.length - 2];
    };

    GapBuffer.prototype.cursorStart = function () {
        while (this.before.length > 0) {
            this.cursorBack();
        }
        return this.cursorCurrent();
    };

    GapBuffer.prototype.cursorEnd = function () {
        while (this.after.length > 1) {
            this.cursorForward();
        }
        return this.cursorCurrent();
    };

    GapBuffer.prototype.cursorUp = function () {

    };

    GapBuffer.prototype.cursorDown = function () {

    };

    GapBuffer.prototype.insert = function (character) {
        this.before.push(character);
        this.fireListeners('change', this);
        return this;
    };

    GapBuffer.prototype.update = function (character) {
        this.after.pop();
        this.after.push(character);
        this.fireListeners('change', this);
        return this;
    };

    GapBuffer.prototype.cut = function () {
        var result = this.after.pop();
        this.fireListeners('change', this);
        return result;
    };

    GapBuffer.prototype.findForward = function (character) {
        return reverseIndex(this.after, character);
    };

    GapBuffer.prototype.findBack = function (character) {
        var index;
        if (this.cursorCurrent() === character) {
            return 0;
        }
        index = reverseIndex(this.before, character);
        return index === -1 ? index : index + 1;
    };

    GapBuffer.prototype.load = function (text) {
        this.after = text.split('').reverse();
    };

    GapBuffer.prototype.read = function () {

        return this.before
            .concat(this.after.slice(0).reverse())
            .join('');
    };

    GapBuffer.prototype.readAt = function (index) {

        if (index < 0) {
            return null;
        }

        if (index < this.before.length) {
            return this.before[index];
        }

        if (index >= (this.before.length + this.after.length)) {
            return null;
        }

        return this.after[this.after.length - 1 - (index - this.before.length)];
    };


    return GapBuffer;

}());
