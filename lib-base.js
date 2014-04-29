/*jslint node: true */
'use strict';

exports.repeat = function (count, func) {
    var i, result = [];
    for (i = 0; i < count; i += 1) {
        result.push(func());
    }
    return result;
};

exports.lines = function (buf) {
    var result  = [[]],
        index   = 0,
        row     = 0,
        character;

    while (index <= buf.length) {
        character = buf.charAt(index);
        result[row].push({
            character: character,
            index: index,
            cursor: buf.cursorPosition() === index,
        });
        if (character === '\n') {
            result.push([]);
            row += 1;
        }
        index += 1;
    }

    return result;
};

exports.cursorBOL = function () {
};

exports.cursorEOL = function () {
};
