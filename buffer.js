/*jslint node: true */
'use strict';

var GapBuffer = require('./gap-buffer').GapBuffer;

module.exports.Buffer = (function BufferClosure() {

    function Buffer(text) {
        GapBuffer.call(this, text);
    }

    Buffer.prototype = GapBuffer.prototype;
    Buffer.prototype.constructor = Buffer;

    return Buffer;

}());
