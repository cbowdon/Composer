/*jslint node: true */
'use strict';

var Buffer = require('./buffer').Buffer;

module.exports.BufferRouter = (function BufferRouterClosure() {

    function BufferRouter() {
        this.buffers = [new Buffer()];
        this.index = 0;
    }

    BufferRouter.prototype.add = function () {
        this.buffers.push(new Buffer());
        this.index = this.count - 1;
        return this.activeBuffer;
    };

    BufferRouter.prototype.remove = function () {
        this.buffers.splice(this.index, 1);
        this.index -= 1;
        if (this.count === 0) {
            return this.add();
        }
        return this.activeBuffer;
    };

    BufferRouter.prototype.next = function () {
        this.index += 1;
        if (this.index >= this.count) {
            this.index = 0;
        }
        return this.activeBuffer;
    };

    BufferRouter.prototype.previous = function () {
        this.index -= 1;
        if (this.index < 0) {
            this.index = this.count - 1;
        }
        return this.activeBuffer;
    };

    BufferRouter.prototype.select = function (i) {
        this.index = i;
        return this.activeBuffer;
    };

    Object.defineProperty(BufferRouter.prototype, 'count', {
        get: function () { return this.buffers.length; }
    });

    Object.defineProperty(BufferRouter.prototype, 'activeBuffer', {
        get: function () { return this.buffers[this.index]; }
    });

    return BufferRouter;

}());
