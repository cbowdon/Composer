/*jslint node: true */
'use strict';

exports.Cursor = (function CursorClosure() {

    function Cursor(buffer) {
        this.b = buffer;
    }

    Cursor.prototype.toIndex = function (index) {
        if (index < 0 || index > this.b.length) {
            return undefined;
        }
        while (this.b.index > index) {
            this.b.cursorBack();
        }
        while (this.b.index < index) {
            this.b.cursorForward();
        }
        return this.current();
    };

    Cursor.prototype.left = function (count) {
        this.b.cursorBack(count);
        this.b.virtualCol = this.b.col;
        return this.current();
    };

    Cursor.prototype.right = function (count) {
        this.b.cursorForward(count);
        this.b.virtualCol = this.b.col;
        return this.current();
    };

    Cursor.prototype.start = function () {
        return this.toIndex(this.b.start);
    };

    Cursor.prototype.end = function () {
        return this.toIndex(this.b.end);
    };

    Cursor.prototype.startOfLine = function () {
        return this.toIndex(this.b.startOfLine);
    };

    Cursor.prototype.endOfLine = function () {
        return this.toIndex(this.b.endOfLine);
    };

    Cursor.prototype.up = function () {
        return this.toIndex(this.b.up);
    };

    Cursor.prototype.down = function () {
        return this.toIndex(this.b.down);
    };

    Cursor.prototype.current = function () {
        return this.b.cursorCurrent();
    };

    Cursor.prototype.to = function (character) {
        var dist = this.b.findForward(character);

        return dist === -1 || dist === 0 ?
                this.current() :
                this.right(dist);
    };

    Cursor.prototype.backTo = function (character) {
        var dist = this.b.findBack(character);

        return dist === -1 || dist === 0 ?
                this.current() :
                this.left(dist);
    };

    Cursor.prototype.peek = function () {
        return this.b.charAt(this.b.index + 1);
    };

    return Cursor;
}());
