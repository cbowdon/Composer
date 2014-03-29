/*jslint node: true */
'use strict';

var GapBuffer = require('./gap-buffer').GapBuffer;

module.exports.Buffer = (function BufferClosure() {

    function Buffer() {
        GapBuffer.call(this);
    }

    Buffer.prototype = GapBuffer.prototype;
    Buffer.prototype.constructor = Buffer;

    return Buffer;

}());
