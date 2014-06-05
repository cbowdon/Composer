/*jslint node: true */
'use strict';

var publisher   = require('./publisher'),
    repeat      = require('./lib-base').repeat;

exports.GapBuffer = (function GapBufferClosure() {

    // 'Private' helper functions
    function isSingleChar(c) {
        return typeof c === 'string' && c.length === 1;
    }

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
        if (after.length === 0) {
            return { success: false };
        }
        return { success: true, value: after[after.length - 1] };
    }

    function cursorPosition(before, after) {
        return before.length;
    }

    function cursorForward(before, after, count) {
        var n = count === 0 ? 0 : count || 1;

        return repeat(n, function () {

            if (after.length === 1) {
                return { success: true, value: null };
                // but don't actually pop the null terminator
            }

            before.push(after.pop());

            return cursorCurrent(before, after);
        }).pop();
    }

    function cursorBack(before, after, count) {
        var n = count === 0 ? 0 : count || 1;

        return repeat(n, function () {

            if (before.length === 0) {
                return { success: false };
            }

            after.push(before.pop());

            return cursorCurrent(before, after);
        }).pop();
    }

    function cursorRow(before, after) {
        return before.reduce(function (b, a) {
            return a === '\n' ? b + 1 : b;
        }, 0);
    }

    function cursorCol(before, after) {
        var lastNL = before.lastIndexOf('\n');
        return lastNL === -1 ?
                before.length :
                before.length - lastNL - 1;
    }

    function cut(before, after) {
        return before.length === 0 ?
                { success: false } :
                { success: true, value: before.pop() };
    }

    function insert(before, after, character) {
        return { success: true, value: before.push(character) };
    }

    function update(before, after, character) {
        var popped;
        if (after.length === 1) {
            return { success: false };
        }
        popped = after.pop();
        after.push(character);
        return { success: true, value: popped };
    }

    // Actual 'class'
    function GapBuffer(text) {
        // Actually implemented as 2 stacks rather than the
        // traditional giant split buffer with pointers.
        // The 'after' stack is reversed,
        // for O(1) insertion at the front.
        var before  = [],
            after   = [null];

        Object.defineProperties(this, publisher);

        Object.defineProperties(this, {
            length: { get: function () { return before.length + after.length - 1; } },
            index: { get: function () { return cursorPosition(before, after); } },
            row: { get: function () { return cursorRow(before, after); } },
            col: { get: function () { return cursorCol(before, after); } },
        });

        this.load = function (text) {
            after = text.split('').concat([null]).reverse();
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

        this.cut = function (number) {
            var n, i, result = [];

            n = number === 0 ? 0 : number || 1;

            if (this.index < n) {
                return { success: false };
            }

            for (i = 0; i < n; i += 1) {
                result.push(cut(before, after));
            }

            result.reverse();

            this.fireListeners('change', this);
            return {
                success: true,
                value: result.map(function (r) { return r.value; }).join('')
            };
        };

        this.insert = function (arg) {

            if (isSingleChar(arg)) {

                insert(before, after, arg);

            } else if (typeof arg === 'string') {

                arg.split('').forEach(insert.bind(null, before, after));

            } else if (typeof arg === 'object' && arg.every(isSingleChar)) {

                arg.forEach(insert.bind(null, before, after));

            } else {

                throw new TypeError('Expecting a string or an array of chars');

            }
            this.fireListeners('change', this);
            return { success: true, value: arg.length };
        };

        this.update = function (character) {
            var result = update(before, after, character);
            this.fireListeners('change', this);
            return result;
        };

        if (text) {
            this.load(text);
        }
    }

    return Object.seal(GapBuffer);

}());
