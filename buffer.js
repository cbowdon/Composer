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
        start: {
            value: 0,
        },
        end: {
            get: function () { return this.length; },
        },
        startOfLine: {
            get: function () {
                var prv = this.prev('\n'),
                    idx = this.index;

                switch (prv) {
                case -1: // start of buffer
                    return this.start;
                case idx: // on '\n'
                    return this.charAt(idx - 1) === '\n' ?
                            idx : // blank line
                            this.lastIndexOf('\n', idx - 1) + 1; // end-line
                default: // mid-line
                    return prv + 1;
                }
            },
        },
        endOfLine: {
            get: function () {
                var nxt = this.next('\n');
                return nxt === -1 ? this.end : nxt;
            },
        },
    });

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
        var index = this.indexOf(character, this.cursorPosition());

        return index === -1 ? index : index - this.cursorPosition();
    };

    Buffer.prototype.findBack = function (character) {
        var index = this.lastIndexOf(character, this.cursorPosition());

        return index === -1 ? index : this.cursorPosition() - index;
    };

    Buffer.prototype.cursorPeek = function () {
        return this.charAt(this.cursorPosition() + 1);
    };

    Buffer.prototype.cursorToIndex = function (index) {
        if (index < 0 || index > this.length) {
            return undefined;
        }
        while (this.cursorPosition() > index) {
            this.cursorBack();
        }
        while (this.cursorPosition() < index) {
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

        this.cursorToIndex(0);

        return this.cursorCurrent();
    };

    Buffer.prototype.cursorEnd = function () {

        this.cursorToIndex(this.length);

        return { done: true };
    };

    Buffer.prototype.cursorUp = function () {
        var origCol = this.cursorCol(),
            distBOL = this.findBack('\n');

        if (distBOL === -1) {
            return this.cursorCurrent();
        }
        this.cursorBack(distBOL + 1);

        while (this.cursorCol() > origCol) {
            this.cursorBack();
        }

        return this.cursorCurrent();
    };

    Buffer.prototype.cursorDown = function () {
        var origCol = this.cursorCol(),
            distEOL = this.findForward('\n');

        if (distEOL === -1) {
            return this.cursorCurrent();
        }

        this.cursorForward(distEOL + 1);

        while (this.cursorCol() < origCol) {
            this.cursorForward();
        }

        return this.cursorCurrent();
    };

    return Buffer;

}());
