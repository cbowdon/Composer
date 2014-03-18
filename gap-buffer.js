(function (exports) {
    'use strict';

    exports.GapBuffer = (function GapBufferClosure() {

        function GapBuffer(after) {
            this.before = '';
            this.after = after || '';
        }

        GapBuffer.prototype.cursorCurrent = function () {
            return this.after[0];
        };

        GapBuffer.prototype.cursorForward = function () {

            console.log("forward1", "before: ", this.before, ", after:",  this.after);

            if (this.after.length === 0) {
                return this.before[this.before.length - 1];
            }

            this.before += this.after[0];
            this.after = this.after.substring(1);

            console.log("forward2", "before: ", this.before, ", after:",  this.after);

            return this.after[0];
        };

        GapBuffer.prototype.cursorBack = function () {

            console.log("back", "before: ", this.before, ", after:",  this.after);

            var lastIndex;

            if (this.before.length === 0) {
                return this.after[0];
            }

            lastIndex = this.before.length - 1;

            this.after = this.before[lastIndex] + this.after;
            this.before = this.before.substring(0, lastIndex);
            return this.after[0];
        };

        GapBuffer.prototype.read = function () {
            return this.before + this.after;
        };

        GapBuffer.prototype.insert = function (character) {
        };

        GapBuffer.prototype.update = function (character) {
        };

        GapBuffer.prototype.clear = function (character) {
        };

        return GapBuffer;

    }());

}(this));
