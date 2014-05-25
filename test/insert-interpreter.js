/*jslint node: true */
'use strict';

var Insert = require('../insert-interpreter').InsertInterpreter,
    Buffer = require('../buffer').Buffer;

exports.tests = [
    function InsertInterpreter_tests_not_implemented() {
        throw new Error();
    },

    function InsertInterpreter_input() {
        var buffer = new Buffer(),
            insert = new Insert(buffer);

        this.cases = {
            '<CR>': { insert: '\n' },
            '<Tab>': { insert: '    ' },
            'x': { insert: 'x' },
        };

        Object
            .keys(this.cases)
            .forEach(insert.input.bind(insert));

        throw new Error('should subscribe');
    },
];
