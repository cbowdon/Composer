/*jslint node: true */
'use strict';

var assert    = require('assert'),
    publisher = require('../publisher');

exports.tests = [
    function Publisher_addEventListener() {
        var pub = Object.defineProperties({}, publisher);

        pub.addEventListener('pop', function () {
            return 'weasel';
        });

        console.log(pub.listeners);
        assert.ok(pub.listeners.hasOwnProperty('pop'));
        assert.strictEqual(pub.listeners.pop.length, 1);
    },
    function Publisher_fireListeners() {
        var pub       = Object.defineProperties({}, publisher),
            callCount = 0,
            testArg = null;

        pub.addEventListener('pop', function (arg) {
            callCount += 1;
            testArg = arg;
        });

        assert.strictEqual(callCount, 0);
        assert.strictEqual(null, testArg);

        pub.fireListeners('monkey', 'stick');
        assert.strictEqual(callCount, 0);
        assert.strictEqual(null, testArg);

        pub.fireListeners('pop', 'weasel');
        assert.strictEqual(callCount, 1);
    },
];
