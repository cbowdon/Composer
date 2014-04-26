/*jslint node: true */
'use strict';

var assert  = require('assert'),
    Queue   = require('../queue').Queue;

exports.tests = [
    function Queue_pop() {
        var queue = new Queue(3);

        queue.push('a');
        queue.push('b');
        queue.push('c');

        assert.strictEqual(queue.length, 3);

        assert.strictEqual(queue.pop(), 'a');
        assert.strictEqual(queue.length, 2);

        assert.strictEqual(queue.pop(), 'b');
        assert.strictEqual(queue.length, 1);

        assert.strictEqual(queue.pop(), 'c');
        assert.strictEqual(queue.length, 0);

        assert.strictEqual(queue.pop(), undefined);
        assert.strictEqual(queue.length, 0);

        assert.strictEqual(queue.pop(), undefined);
        assert.strictEqual(queue.length, 0);
    },

    function Queue_push() {
        var queue = new Queue(3);

        queue.push('a');
        queue.push('b');
        queue.push('c');
        queue.push('d');

        assert.strictEqual(queue.pop(), 'b');
        assert.strictEqual(queue.pop(), 'c');
        assert.strictEqual(queue.pop(), 'd');
    },

    function Queue_itemAt() {
        var queue = new Queue(9);

        queue.push('a');
        queue.push('b');

        assert.strictEqual(queue.itemAt(0), 'a');
        assert.strictEqual(queue.itemAt(1), 'b');
        assert.strictEqual(queue.itemAt(2), undefined);

        queue.push('c');
        assert.strictEqual(queue.itemAt(2), 'c');

        queue.pop();
        assert.strictEqual(queue.itemAt(0), 'b');
        assert.strictEqual(queue.itemAt(1), 'c');
        assert.strictEqual(queue.itemAt(2), undefined);

        queue.pop();
        assert.strictEqual(queue.itemAt(0), 'c');

        queue.pop();
        assert.strictEqual(queue.itemAt(0), undefined);
    },

    function Queue_index() {
        var queue = new Queue(9);
        queue.push('a');
        assert.strictEqual(queue[0], 'a');

        queue.push('b');
        assert.strictEqual(queue[0], 'a');
        assert.strictEqual(queue[1], 'b');

        queue.push('c');
        queue.push('d');
        queue.pop();
        queue.push('e');
        queue.push('f');

        assert.strictEqual(queue[0], 'b');
        assert.strictEqual(queue[1], 'c');
        assert.strictEqual(queue[2], 'd');
        assert.strictEqual(queue[3], 'e');
        assert.strictEqual(queue[4], 'f');
    },

    /* ignore
    function Queue_maxLength() {
        var queue = new Queue(3);

        queue.push('a');
        queue.push('b');
        queue.push('c');

        assert.strictEqual(queue.length, 3);

        queue.maxLength = 2;

        assert.strictEqual(queue.length, 2);
        assert.strictEqual(queue.pop(), 'a');
        assert.strictEqual(queue.pop(), 'b');
        assert.strictEqual(queue.pop(), undefined);
    }, */

    function Queue_reduce() {
        var queue = new Queue(3);

        queue.push(1);
        queue.push(2);
        queue.push(3);

        assert.strictEqual(queue.reduce(function (b, a) { return b + a; }), 6);
    },
];
