/*jslint node: true */
'use strict';

exports.Writer = (function WriterClosure() {

    function Writer(gapBuffer) {
        this.gapBuffer  = gapBuffer;
        this.history    = [];
        this.future     = [];
    }

    Writer.prototype.actions = {
        cut: function (arg) {
            var result = this.gapBuffer.cut(arg);
            return { insert: result };
        },
        insert: function (arg) {
            this.gapBuffer.insert(arg);
            return { cut: arg.length };
        },
        back: function (arg) {
            this.gapBuffer.back(arg);
            return { forward: arg };
        },
        forward: function (arg) {
            this.gapBuffer.forward(arg);
            return { back: arg };
        },
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
            result.undo = that.actions[key](it[key]);

            return result;
        });

        this.history.push(results);

        return results;
    };

    Writer.prototype.undo = function () {
        var result = this.history.pop();
        this.future.push(result.undo());
    };

    Writer.prototype.redo = function () {
        var result = this.future.pop();
        this.history.push(result.undo());
    };

    return Writer;

}());