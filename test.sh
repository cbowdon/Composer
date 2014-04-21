#!/bin/bash

function lint {
    jslint *.js test/*.js
}

function unitTest {
    node test/main.js
}

result=$(lint)
lintStatus=$?

if ! [ $lintStatus -eq 0 ]; then
    lint | less; # not using $result because newlines not observed
fi

result=$(unitTest)
unitTestStatus=$?

if ! [ $unitTestStatus -eq 0 ]; then
    unitTest | less;
fi

exit $lintStatus && $unitTestStatus
