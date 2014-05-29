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
        if (result.success) {
            return { insert: result.value };
        }
        return { noop: 'nothing to undo' };
    };

    Writer.prototype.insert = function (arg) {
        var result = this.gapBuffer.insert(arg);
        if (result.success) {
            return { cut: arg.length };
        }
        return { noop: 'nothing to undo' };
    };

    Writer.prototype.forward = function (arg) {
        var result = this.gapBuffer.cursorForward(arg);
        if (result.success) {
            return { back: arg };
        }
        return { noop: 'nothing to undo' };
    };

    Writer.prototype.back = function (arg) {
        var result = this.gapBuffer.cursorBack(arg);
        if (result.success) {
            return { forward: arg };
        }
        return { noop: 'nothing to undo' };
    };

    Writer.prototype.noop = function () {
        return { noop: 'nothing to undo' };
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

            console.log({
                result: result,
                state: that.gapBuffer.toString(),
                index: that.gapBuffer.index,
            });

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
