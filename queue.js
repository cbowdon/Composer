/*jslint node: true */
'use strict';

exports.Queue = (function QueueClosure() {
    function Queue(maxLength) {
        var inbox   = [],
            outbox  = [];

        Object.defineProperty(this, 'length', {
            get: function () { return inbox.length + outbox.length; }
        });

        this.itemAt = function (index) {
            if (index < 0 || index >= this.length) {
                return undefined;
            }
            if (index < outbox.length) {
                return outbox[outbox.length - index - 1];
            }
            return inbox[index - outbox.length];

        };

        this.push = function (item) {
            var lastIndex = this.length;

            inbox.push(item);
            while (this.length > maxLength) {
                this.pop();
            }

            // add index accessor
            if (!this.hasOwnProperty(lastIndex)) {
                Object.defineProperty(this, lastIndex, {
                    get: function () { return this.itemAt(lastIndex); },
                });
            }
        };

        this.pop = function () {
            if (outbox.length === 0 && inbox.length !== 0) {
                while (inbox.length > 0) {
                    outbox.push(inbox.pop());
                }
            }

            return outbox.pop();
        };

        this.reduce = Array.prototype.reduce;
        this.map = Array.prototype.map;
        this.forEach = Array.prototype.forEach;
        this.filter = Array.prototype.filter;
    }


    return Queue;
}());
