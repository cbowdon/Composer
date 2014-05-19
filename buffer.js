/*jslint node: true */
'use strict';

var GapBuffer   = require('./gap-buffer').GapBuffer,
    Cursor      = require('./cursor').Cursor;

exports.Buffer = (function BufferClosure() {

    function Buffer(text) {
        GapBuffer.call(this, text);
        this.cursor = new Cursor(this);
    }

    Buffer.prototype.constructor = Buffer;

    Object.defineProperties(Buffer.prototype, {
        // Basic cursor directions
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
                    col     = this.virtualCol;

                return Math.min(prvLn.start + col, prvLn.end);
            },
        },
        down: {
            get: function () {
                var curLn   = this.line(this.index),
                    nxtLn   = this.line(curLn.end + 1),
                    col     = this.virtualCol;

                return Math.min(nxtLn.start + col, nxtLn.end);
            },
        },
        // Column prior to any up/down movements
        virtualCol: {
            value: 0,
            writable: true,
        },
        // Start/end of buffer
        start: {
            value: 0,
        },
        end: {
            get: function () { return this.length; },
        },
        // Start/end of line
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

    // Read-only functions

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

    return Buffer;

}());
