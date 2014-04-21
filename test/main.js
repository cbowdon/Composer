/*jslint node: true */
'use strict';

var failCount,
    testSuites;


testSuites = [
    require('./publisher'),
    require('./frame'),
    require('./gap-buffer'),
    require('./buffer-router'),
    require('./normal-functions'),
];

failCount = testSuites.reduce(function (failCount, suite) {
    return failCount + suite.tests.reduce(function (failCount, test) {
        try {
            test();
            console.log(test.name, "- OK");
            return failCount;
        } catch (ex) {
            console.log(test.name, '\n', ex);
            return failCount + 1;
        }
    }, 0);
}, 0);

process.exit(failCount);
