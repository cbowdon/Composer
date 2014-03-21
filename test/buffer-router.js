/*jslint node: true */
'use strict';

var assert       = require('assert'),
    BufferRouter = require('../buffer-router').BufferRouter;

exports.tests = [
    function BufferRouter_add() {
        var bufferRouter = new BufferRouter();

        assert.strictEqual(bufferRouter.count, 1);
        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.add();
        assert.strictEqual(bufferRouter.count, 2);
        assert.strictEqual(bufferRouter.index, 1);

        bufferRouter.add();
        assert.strictEqual(bufferRouter.count, 3);
        assert.strictEqual(bufferRouter.index, 2);
    },
    function BufferRouter_remove() {
        var bufferRouter = new BufferRouter();

        assert.strictEqual(bufferRouter.count, 1);
        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.remove();
        assert.strictEqual(bufferRouter.count, 1);
        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.add();
        assert.strictEqual(bufferRouter.count, 2);
        assert.strictEqual(bufferRouter.index, 1);

        bufferRouter.remove();
        assert.strictEqual(bufferRouter.count, 1);
        assert.strictEqual(bufferRouter.index, 0);
    },
    function BufferRouter_next() {
        var bufferRouter = new BufferRouter();

        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.next();
        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.add();
        assert.strictEqual(bufferRouter.index, 1);

        bufferRouter.remove();
        assert.strictEqual(bufferRouter.index, 0);
    },
    function BufferRouter_previous() {
        var bufferRouter = new BufferRouter();

        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.previous();
        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.add();
        assert.strictEqual(bufferRouter.index, 1);

        bufferRouter.previous();
        assert.strictEqual(bufferRouter.index, 0);

        bufferRouter.previous();
        assert.strictEqual(bufferRouter.index, 1);

        bufferRouter.previous();
        assert.strictEqual(bufferRouter.index, 0);
    },
];
