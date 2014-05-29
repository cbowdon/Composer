/*jslint node: true */
'use strict';

var GapBuffer = require('./gap-buffer').GapBuffer;

exports.Writer = (function WriterClosure() {

    function Writer(text) {
        this.gapBuffer  = new GapBuffer(text);
        this.history    = [];
        this.future     = [];
    }

    Writer.prototype.cut = function (arg) {
        var result = this.gapBuffer.cut(arg);
        return { insert: result };
    };

    Writer.prototype.insert = function (arg) {
        this.gapBuffer.insert(arg);
        return { cut: arg.length };
    };

    Writer.prototype.forward = function (arg) {
        this.gapBuffer.cursorForward(arg);
        return { back: arg };
    };

    Writer.prototype.back = function (arg) {
        this.gapBuffer.cursorBack(arg);
        return { forward: arg };
    };

    Writer.prototype.write = function (acts) {
        var that = this,
            results;

        results = acts.map(function (it) {
            var keys    = Object.keys(it),
                key     = keys[0],
                result  = {};

            if (keys.length !== 1) {
                throw new TypeError('Expecting one instruction per block: ' + keys);
            }

            result[key] = it[key];
            result.undo = that[key](it[key]);

            /*
            console.log({
                act: it,
                result: result,
                state: that.gapBuffer.toString(),
                index: that.gapBuffer.index,
            });
            */

            return result;
        });

        this.history.push(results);

        return results;
    };

    Writer.prototype.undo = function () {
        var dos, undos;

        dos = this.history.pop();

        undos = dos.map(function (act) { return act.undo; });

        undos.reverse();

        console.log('undos', undos);

        this.write(undos);
    };

    Writer.prototype.redo = function () {
    };

    return Writer;

}());
