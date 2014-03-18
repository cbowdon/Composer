/*jslint node: true */
'use strict';

var testSuites = [
    require('./gap-buffer.js'),
    require('./host.js'),
];

testSuites.forEach(function (suite) {
    suite.tests.forEach(function (test) {
        try {
            test();
        } catch (ex) {
            console.log(test.name, '\n', ex, '\n');
        }
    });
});
