(function (exports) {
    'use strict';

    exports.Buffer = (function BufferClosure() {

        function Buffer() {
            this.state = [[]];
            this.mode = 'normal';
            this.cursor = { row: 0, col: 0 };
            this.marks = [];
            this.history = [];
            this.selection = {};
        }

        Buffer.prototype.currentRow = function () {
            return this.state[this.cursor.row];
        };

        Buffer.prototype.increment = function () {
            var col = this.cursor.col;
            if (col >= this.currentRow.length - 1) {
                this.cursor.row += 1;
                this.cursor.col = 0;
                return this;
            }
            this.cursor.col += 1;
            return this;
        };

        Buffer.prototype.decrement = function () {
            var col = this.cursor.col;
            if (col <= 0) {
                this.cursor.row -= 1;
                this.cursor.col = this.currentRow.length - 1;
                return this;
            }
            this.cursor.col -= 1;
            return this;
        };

        Buffer.prototype.clear = function (region) {
            var before  = this.currentRow.slice(0, region.start),
                after   = this.currentRow.slice(region.end);

            this.currentRow = before + after;
            this.cursor.col = region.end;
            return this;
        };

        Buffer.prototype.runCommand = function (cmd) {
            return cmd(this);
        };

        return Buffer;

    }());

}(this));
