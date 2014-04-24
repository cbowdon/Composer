/*jslint node: true */
'use strict';

var BufferRouter        = require('./buffer-router').BufferRouter,
    InsertInterpreter   = require('./insert-interpreter').InsertInterpreter;

exports.ModeRouter = (function ModeRouterClosure() {

    function ModeRouter() {
        this.bufferRouter   = new BufferRouter();
        this.insert         = new InsertInterpreter(this.bufferRouter);
    }

    ModeRouter.prototype.handleKeyPress = function (key) {
        this.insert.input(key);
    };

    return ModeRouter;

}());
