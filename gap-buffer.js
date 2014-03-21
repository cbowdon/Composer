(function (exports) {
    'use strict';

    exports.GapBuffer = (function GapBufferClosure() {

        function GapBuffer(after) {
            // Actually implemented as 2 stacks rather than the
            // traditional giant split buffer with pointers.
            // The 'after' stack is reversed,
            // for O(1) insertion at the front.
            this.before = [];
            this.after = after ? after.split('').reverse() : [];
        }

        GapBuffer.prototype.cursorCurrent = function () {
            return this.after[this.after.length - 1];
        };

        GapBuffer.prototype.cursorForward = function () {
            // moves a char from after to before
            var movedChar;

            // 'stick' at the end of the buffer
            if (this.after.length > 1) {
                movedChar = this.after.pop();
            }

            if (movedChar) {
                this.before.push(movedChar);
            }

            return this.cursorCurrent();
        };

        GapBuffer.prototype.cursorBack = function () {
            var movedChar = this.before.pop();

            if (movedChar) {
                this.after.push(movedChar);
            }

            return this.cursorCurrent();
        };

        GapBuffer.prototype.read = function () {

            return this.before
                .concat(this.after.slice(0).reverse())
                .join('');
        };

        GapBuffer.prototype.insert = function (character) {
            this.before.push(character);
            return this;
        };

        GapBuffer.prototype.update = function (character) {
            this.after.pop();
            this.after.push(character);
            return this;
        };

        GapBuffer.prototype.cut = function () {
            return this.after.pop();
        };

        return GapBuffer;

    }());

}(this));
