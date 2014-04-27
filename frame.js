/*jslint node: true */
'use strict';


var BufferStack = (function BufferStackClosure() {

    function BufferStack(buffer, offset) {
        this.buffer   = buffer;
        this.preStack = [];
        this.index    = offset || 0;
    }

    Object.defineProperty(BufferStack.prototype, 'empty', {
        get: function () {
            return this.index > (this.preStack.length + this.buffer.length - 1);
        }
    });


    BufferStack.prototype.push = function (item, count) {
        var max = count || 1, i;
        for (i = 0; i < max; i += 1) {
            this.preStack.push(item);
        }
    };

    BufferStack.prototype.pop = function () {
        var result;
        if (this.preStack.length > 0) {
            return this.preStack.pop();
        }

        result = this.buffer.charAt(this.index);
        this.index += 1;
        return result;
    };

    BufferStack.prototype.next = function () {
        return { done: this.empty, value: this.pop() };
    };

    return BufferStack;
}());

exports.Framer = (function FramerClosure() {

    function Framer(rows, cols, tabStop) {
        this.rows     = rows || 10;
        this.cols     = cols || 40;
        this.tabStop  = tabStop || 4;
    }

    Framer.prototype.frame = function (buffer, offset) {
        var rowIndex    = 0,
            colIndex    = 0,
            stack       = new BufferStack(buffer, offset),
            that        = this;

        return {

            next: function () {
                var character,
                    distToEOL,
                    index = (rowIndex + 1) * colIndex,
                    hasCursor = index === buffer.cursorPosition();

                if (colIndex >= that.cols) {
                    // plus 1 to include the '\n' itself
                    distToEOL = buffer.indexOf('\n', index) - index + 1;
                    while (distToEOL > 0) {
                        // no wrap - discard these
                        stack.pop();
                        distToEOL -= 1;
                    }
                    colIndex = 0;
                    rowIndex += 1;
                }

                colIndex += 1;

                if (rowIndex >= that.rows || stack.empty) {
                    return { done: true, cursor: hasCursor };
                }

                character = stack.pop();

                if (character === '\t') {
                    stack.push(' ', that.tabStop - 1);
                    return { done: false, value: ' ', cursor: hasCursor };
                }

                if (character === '\n') {
                    stack.push(undefined, that.cols - colIndex);
                    return { done: false, value: undefined, cursor: false };
                }

                return { done: false, value: character, cursor: hasCursor };
            }
        };
    };

    return Framer;
}());
