/*jslint node: true */
'use strict';

var publisher = require('./publisher');

module.exports.GapBuffer = (function GapBufferClosure() {

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

    GapBuffer.prototype.toString = function () {

        return this.before
            .concat(this.after.slice(0).reverse())
            .join('');
    };

    GapBuffer.prototype.charAt = function (index) {

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

    GapBuffer.prototype.load = function (text) {
        this.after = text.split('').reverse();
    };

    GapBuffer.prototype.cursorPosition = function () {
        return this.before.length;
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

    return GapBuffer;

}());
