/*jslint node: true */
'use strict';

var assert = require('assert'),
    normal = require('../normal-functions'),
    Buffer = require('../buffer').Buffer;

function helloBuffer() {
    var buffer  = new Buffer();

    buffer.text.insert('H');
    buffer.text.insert('e');
    buffer.text.insert('l');
    buffer.text.insert('l');
    buffer.text.insert('o');

    buffer.text.cursorStart();

    return buffer;
}

exports.tests = [

    function NormalFunctions_motions_h() {
        var buffer  = helloBuffer(),
            h       = normal.motions.h,
            hRegion = h.action(buffer),
            next;

        buffer.text.cursorForward();

        assert.deepEqual(hRegion(), {
            direction: 'back',
            count: 1
        });
    },

    function NormalFunctions_motions_l() {
        var buffer  = helloBuffer(),
            l       = normal.motions.l,
            lRegion = l.action(buffer),
            next;

        assert.deepEqual(lRegion(), {
            direction: 'forward',
            count: 1
        });
    },

    function NormalFunctions_motions_f() {
        var buffer  = helloBuffer(),
            f       = normal.motions.f,
            region  = f.action(buffer, 'l');

        assert.deepEqual(region(), {
            direction: 'forward',
            count: 3
        });
    },

    function NormalFunctions_motions_t() {
        var buffer  = helloBuffer(),
            t       = normal.motions.t,
            region  = t.action(buffer, 'l');

        assert.deepEqual(region(), {
            direction: 'forward',
            count: 2
        });
    },

    function NormalFunctions_operators_d() {
        var buffer  = helloBuffer(),
            d       = normal.operators.d,
            t       = normal.motions.t,
            region  = t.action(buffer, 'l'),
            dtl;

        dtl = d.action(buffer, region);

        assert.deepEqual(dtl, ['H', 'e']);

        assert.strictEqual(buffer.text.read(), "llo");
    },
];
