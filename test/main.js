/*jslint node: true */
'use strict';

var testSuites = [
    require('./gap-buffer'),
    require('./host'),
    require('./buffer-router'),
];

testSuites.forEach(function (suite) {
    suite.tests.forEach(function (test) {
        try {
            test();
            console.log(test.name, "- OK\n");
        } catch (ex) {
            console.log(test.name, '\n', ex, '\n');
        }
    });
});
