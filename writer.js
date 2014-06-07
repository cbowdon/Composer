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

    function writeSingle(that, act) {
        var keys    = Object.keys(act),
            key     = keys[0],
            result  = {};

        if (keys.length !== 1) {
            throw new TypeError('Expecting one instruction per block: ' + keys);
        }

        result[key] = act[key];
        result.undo = that[key](act[key]);

        return result;
    }

    function write(that, acts) {
        return acts.map(function (act) {
            return writeSingle(that, act);
        });
    }

    Writer.prototype.write = function (acts) {
        var results = write(this, acts);

        this.history.push(results);

        return results;
    };

    Writer.prototype.undo = function () {
        var dos, undos, redos;

        function undo(act) { return act.undo; }

        dos = this.history.pop();

        if (!dos) {
            return;
        }

        undos = dos.map(undo);

        undos.reverse();

        redos = write(this, undos);

        redos.reverse();

        this.future.push(redos.map(undo));
    };

    Writer.prototype.redo = function () {
        var undos, redos;

        redos = this.future.pop();

        if (!redos) {
            return;
        }

        undos = write(this, redos);

        this.history.push(undos);
    };

    return Writer;

}());
