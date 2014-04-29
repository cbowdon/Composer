/*jslint node: true */
'use strict';

var publisher   = require('./publisher'),
    repeat      = require('./lib-base').repeat;

exports.GapBuffer = (function GapBufferClosure() {

    function toString(before, after) {
        return before
            .concat(after.slice(0).reverse())
            .join('');
    }

    function charAt(before, after, index) {
        if (index < 0) {
            return undefined;
        }

        if (index < before.length) {
            return before[index];
        }

        if (index >= (before.length + after.length)) {
            return undefined;
        }

        return after[after.length - 1 - (index - before.length)];
    }

    function cursorCurrent(before, after) {
        return after[after.length - 1];
    }

    function cursorPosition(before, after) {
        return before.length;
    }

    function cursorForward(before, after, count) {
        return repeat(count || 1, function () {
            var movedChar = after.pop();

            if (movedChar) {
                before.push(movedChar);
            }

            if (after.length === 0) {
                return { done: true };
            }

            return { done: false, value: cursorCurrent(before, after) };
        }).pop();
    }

    function cursorBack(before, after, count) {
        return repeat(count || 1, function () {
            var movedChar = before.pop();

            if (movedChar) {
                after.push(movedChar);
            }

            if (before.length === 0) {
                return { done: true };
            }

            return { done: false, value: cursorCurrent(before, after) };
        }).pop();
    }

    function cut(before, after) {
        var result = after.pop();
        return result;
    }

    function insert(before, after, character) {
        before.push(character);
    }

    function update(before, after, character) {
        after.pop();
        after.push(character);
    }

    function GapBuffer(text) {
        // Actually implemented as 2 stacks rather than the
        // traditional giant split buffer with pointers.
        // The 'after' stack is reversed,
        // for O(1) insertion at the front.
        var before  = [],
            after   = [];

        Object.defineProperties(this, publisher);

        Object.defineProperties(this, {
            length: { get: function () { return before.length + after.length; } },
        });

        this.load = function (text) {
            after = text.split('').reverse();
            this.fireListeners('change', this);
        };

        this.charAt = function (index) {
            return charAt(before, after, index);
        };

        this.toString = function () {
            return toString(before, after);
        };

        this.cursorCurrent = function () {
            return cursorCurrent(before, after);
        };

        this.cursorPosition = function () {
            return cursorPosition(before, after);
        };

        this.cursorForward = function (count) {
            var result = cursorForward(before, after, count);
            this.fireListeners('cursor', this);
            return result;
        };

        this.cursorBack = function (count) {
            var result = cursorBack(before, after, count);
            this.fireListeners('cursor', this);
            return result;
        };

        this.cut = function () {
            var result = cut(before, after);
            this.fireListeners('change', this);
            return result;
        };

        this.insert = function (character) {
            insert(before, after, character);
            this.fireListeners('change', this);
            return this;
        };

        this.update = function (character) {
            update(before, after, character);
            this.fireListeners('change', this);
            return this;
        };

        if (text) {
            this.load(text);
        }
    }

    return GapBuffer;

}());
