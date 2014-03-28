/*jslint node: true */
'use strict';

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

    function GapBuffer(after) {
        // Actually implemented as 2 stacks rather than the
        // traditional giant split buffer with pointers.
        // The 'after' stack is reversed,
        // for O(1) insertion at the front.
        this.before = [];
        this.after = after ? after.split('').reverse() : [];

        this.listeners = {};
    }

    GapBuffer.prototype.addEventListener = function (eventName, listener) {
        if (!this.listeners.hasOwnProperty(eventName)) {
            this.listeners.eventName = [];
        }
        this.listeners.eventName.push(listener);
    };

    GapBuffer.prototype.fireListeners = function (eventName, arg) {
        if (this.listeners.hasOwnProperty(eventName)) {
            this.listeners.eventName.forEach(function (listener) {
                listener(arg);
            });
        }
    };

    GapBuffer.prototype.cursorCurrent = function () {
        return this.after[this.after.length - 1];
    };

    GapBuffer.prototype.cursorForward = function () {
        // moves a char from after to before
        var movedChar;

        // 'stick' at the end of the buffer
        if (this.after.length > 1) {
            movedChar = this.after.pop();
        }

        if (movedChar) {
            this.before.push(movedChar);
        }

        return this.cursorCurrent();
    };

    GapBuffer.prototype.cursorBack = function () {
        var movedChar = this.before.pop();

        if (movedChar) {
            this.after.push(movedChar);
        }

        return this.cursorCurrent();
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

    GapBuffer.prototype.read = function () {
        return this.before
            .concat(this.after.slice(0).reverse())
            .join('');
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

    return GapBuffer;

}());
