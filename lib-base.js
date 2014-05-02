/*jslint node: true */
'use strict';

exports.repeat = function (count, func) {
    var i, result = [];
    for (i = 0; i < count; i += 1) {
        result.push(func());
    }
    return result;
};

exports.lines = function lines(buf) {
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

exports.cursorBOL = function cursorBOL(buf) {
    var distBOL = buf.findBack('\n'),
        prev;

    switch (distBOL) {
    case -1:
        return buf.cursorStart();
    case 0:
        prev = buf.charAt(buf.cursorPosition() - 1);
        if (prev === '\n') {
            return buf.cursorCurrent();
        }
        buf.cursorBack();
        return cursorBOL(buf);
    case 1:
        return buf.cursorCurrent();
    default:
        return buf.cursorBack(distBOL - 1);
    }
};

exports.cursorEOL = function cursorEOL(buf) {
    var distEOL = buf.findForward('\n');

    switch (distEOL) {
    case -1:
        return buf.cursorEnd();
    case 0:
        return buf.cursorCurrent();
    default:
        return buf.cursorForward(distEOL);
    }
};
