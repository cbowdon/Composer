/*jslint node: true */
'use strict';

var GapBuffer = require('./gap-buffer').GapBuffer;

module.exports.Buffer = (function BufferClosure() {

    function Buffer() {
        this.text = new GapBuffer();
    }

    return Buffer;

}());
