/*jslint node: true */
'use strict';

module.exports.Frame = (function FrameClosure() {
    function Frame(buffer, rows, cols, offset, length) {
        this.buffer = buffer;
        this.rows   = rows || 10;
        this.cols   = cols || 40;
        this.offset = offset || 0;
        this.length = length || buffer.length;
    }

    Frame.prototype.next = function () {
        return { done: true };
    };

    return Frame;
}());
