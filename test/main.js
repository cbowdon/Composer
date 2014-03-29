/*jslint node: true */
'use strict';

var testSuites = [
    require('./gap-buffer'),
    require('./buffer-router'),
    require('./normal-functions'),
    require('./publisher'),
];

testSuites.forEach(function (suite) {
    suite.tests.forEach(function (test) {
        try {
            test();
            console.log(test.name, "- OK");
        } catch (ex) {
            console.log(test.name, '\n', ex);
        }
    });
});
