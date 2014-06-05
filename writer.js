/*jslint node: true */
'use strict';

var GapBuffer = require('./gap-buffer').GapBuffer;

exports.Writer = (function WriterClosure() {

    /*
        insert: cut
        forward: back,
        update: update,

        cut: removes the character before the cursor
        insert: add character before the cursor
        update: overwrites the character at the cursor
    */

    function Writer(text) {
        this.gapBuffer  = new GapBuffer(text);
        this.history    = [];
        this.future     = [];
    }

    Writer.prototype.update = function (arg) {
        var result = this.gapBuffer.update(arg);
        if (result.success) {
            return { cut: result.value };
        }
        return { noop: 'nothing to undo' };
    };

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

    function write(that, acts) {
        return acts.map(function (it) {
            var keys    = Object.keys(it),
                key     = keys[0],
                result  = {};

            if (keys.length !== 1) {
                throw new TypeError('Expecting one instruction per block: ' + keys);
            }

            result[key] = it[key];
            result.undo = that[key](it[key]);

            return result;
        });
    }

    Writer.prototype.write = function (acts) {
        var results = write(this, acts);

        this.history.push(results);

        return results;
    };

    Writer.prototype.undo = function () {
        var dos, undos;

        dos = this.history.pop();

        if (!dos) {
            return;
        }

        undos = dos.map(function (act) { return act.undo; });

        undos.reverse();

        write(this, undos);
    };

    Writer.prototype.redo = function () {
    };

    return Writer;

}());
