/*jslint node: true */
'use strict';

module.exports.Frame = (function FrameClosure() {

    function Frame(rows, cols, tabStop) {
        this.rows     = rows || 10;
        this.cols     = cols || 40;
        this.tabStop  = tabStop || 4;
    }

    Frame.prototype.frame = function (buffer, offset) {
        var index       = offset || 0,
            blanks      = 0,
            rowIndex    = 0,
            colIndex    = 0,
            that        = this;

        return {
            next: function () {
                var character;

                if (colIndex >= that.cols) {
                    colIndex = 0;
                    rowIndex += 1;
                }

                if (rowIndex >= that.rows) {
                    return { done: true };
                }

                colIndex += 1;

                if (blanks > 0) {
                    blanks -= 1;
                    return { done: false, value: ' ' };
                }

                if (index > buffer.length) {
                    return { done: true };
                }

                character = buffer.readAt(index);
                index += 1;

                if (!character) {
                    return { done: true };
                }

                if (character === '\t') {
                    blanks = that.tabStop - 1;
                    return { done: false, value: ' ' };
                }

                if (character === '\n') {
                    blanks = that.cols - colIndex;
                    return { done: false, value: ' ' };
                }

                return { done: false, value: character };
            }
        };
    };

    return Frame;
}());
