/*jslint node: true */
'use strict';

var GapBuffer = require('./gap-buffer').GapBuffer;

exports.Buffer = (function BufferClosure() {

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

    Object.defineProperties(Buffer.prototype, {
        left: {
            get: function () { return this.index - 1; },
        },
        right: {
            get: function () { return this.index + 1; },
        },
        up: {
            get: function () {
                var curLn   = this.line(this.index),
                    prvLn   = this.line(curLn.start - 1),
                    col     = this.col;

                return Math.min(prvLn.start + col, prvLn.end);
            },
        },
        down: {
            get: function () {
                return this.endOfLine + this.col + 1;
            },
        },
        start: {
            value: 0,
        },
        end: {
            get: function () { return this.length; },
        },
        startOfLine: {
            get: function () {
                return this.line(this.index).start;
            },
        },
        endOfLine: {
            get: function () {
                return this.line(this.index).end;
            },
        },
    });

    Buffer.prototype.line = function (index) {
        var sol = this.lastIndexOf('\n', index),
            eol = this.indexOf('\n', index);

        if (eol === -1) {
            eol = this.end;
        }

        if (sol === -1) {
            sol = this.start;
        } else if (sol === eol) {
            // index is on '\n', look back further
            sol = this.lastIndexOf('\n', index - 1) + 1;
        } else {
            sol += 1;
        }

        return {
            start: sol,
            end: eol,
            length: eol - sol,
        };
    };

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
        var i,
            offset = fromIndex === 0 ?
                    fromIndex :
                    fromIndex || this.length - 1;

        for (i = offset; i >= 0; i -= 1) {
            if (this.charAt(i) === character) {
                return i;
            }
        }

        return -1;
    };

    Buffer.prototype.next = function (character) {
        return this.indexOf(character, this.index);
    };

    Buffer.prototype.prev = function (character) {
        return this.lastIndexOf(character, this.index);
    };

    Buffer.prototype.findForward = function (character) {
        var index = this.indexOf(character, this.index);

        return index === -1 ? index : index - this.index;
    };

    Buffer.prototype.findBack = function (character) {
        var index = this.lastIndexOf(character, this.index);

        return index === -1 ? index : this.index - index;
    };

    Buffer.prototype.cursorPeek = function () {
        return this.charAt(this.index + 1);
    };

    Buffer.prototype.cursorToIndex = function (index) {
        if (index < 0 || index > this.length) {
            return undefined;
        }
        while (this.index > index) {
            this.cursorBack();
        }
        while (this.index < index) {
            this.cursorForward();
        }
        return this.cursorCurrent();
    };

    Buffer.prototype.cursorTo = function (character) {
        var dist = this.findForward(character);

        return dist === -1 || dist === 0 ?
                this.cursorCurrent() :
                this.cursorForward(dist);
    };

    Buffer.prototype.cursorBackTo = function (character) {
        var dist = this.findBack(character);

        return dist === -1 || dist === 0 ?
                this.cursorCurrent() :
                this.cursorBack(dist);
    };

    Buffer.prototype.cursorStart = function () {
        return this.cursorToIndex(this.start);
    };

    Buffer.prototype.cursorEnd = function () {
        return this.cursorToIndex(this.end);
    };

    Buffer.prototype.cursorUp = function () {
        return this.cursorToIndex(this.up);
    };

    Buffer.prototype.cursorDown = function () {
        return this.cursorToIndex(this.down);
    };

    return Buffer;

}());
