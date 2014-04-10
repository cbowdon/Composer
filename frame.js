/*jslint node: true */
'use strict';


module.exports.BufferStack = (function BufferStackClosure() {

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

        result = this.buffer.readAt(this.index);
        this.index += 1;
        return result;
    };

    BufferStack.prototype.next = function () {
        return { done: this.empty, value: this.pop() };
    };

    return BufferStack;
}());

module.exports.Framer = (function FramerClosure() {
    var BufferStack = module.exports.BufferStack;

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
                var character;

                if (colIndex >= that.cols) {
                    colIndex = 0;
                    rowIndex += 1;
                }

                colIndex += 1;

                if (rowIndex >= that.rows) {
                    return { done: true };
                }

                if (stack.empty) {
                    return { done: true };
                }

                character = stack.pop();

                if (character === '\t') {
                    stack.push(' ', that.tabStop - 1);
                    return { done: false, value: ' ' };
                }

                if (character === '\n') {
                    stack.push(undefined, that.cols - colIndex);
                    return { done: false, value: undefined };
                }

                return { done: false, value: character };
            }
        };
    };

    return Framer;
}());
