/*jslint node: true */
'use strict';

exports.Regretter = (function RegretterClosure() {

    function Regretter(gapBuffer) {
        this.gapBuffer = gapBuffer;
        this.actionStack = [];
    }

    Regretter.prototype.run = function (func) {
        var result = this.gapBuffer.run(func);
        this.actionStack.push(result);
    };

    Regretter.prototype.undo = function (count) {
        throw new Error('not yet done');
    };

    Regretter.prototype.actions = {
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

    /*
    var changeXToT = [
        { cut:      1   },
        { insert:   't' },
        { back:     1   },
    ];

    var changeStack = [
        { cut:      1,      undo: {     insert:     'x' } },
        { insert:   't',    undo: {     cut:        1   } },
        { back:     1,      undo: {     forward:    1   } },
    ];
    */

    Regretter.prototype.applyActs = function (acts) {
        var that = this;

        return acts.map(function (it) {
            var keys    = Object.keys(it),
                key     = keys[0],
                result;

            if (keys.length !== 1) {
                throw new TypeError('Expecting one instruction per block: ' + keys);
            }

            result[key] = it[key];
            result.undo = that.actions[key](it[key]);

            return result;
        });
    };
}());
