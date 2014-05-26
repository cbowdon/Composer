/*jslint node: true */
'use strict';

var failCount,
    testSuites;


testSuites = [
    require('./publisher'),
    require('./queue'),
    require('./buffer'),
    require('./lib-base'),
    require('./cursor'),
    require('./gap-buffer'),
    require('./writer'),
    require('./router'),
    require('./insert-interpreter'),
    require('./normal-interpreter'),
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
