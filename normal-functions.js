/*jslint node: true */
'use strict';

module.exports.motions = {

    'h': {
        accepts: 'none',
        action: function h(buffer) {
            var stopIteration = false;
            return {
                next: function h() {
                    if (stopIteration) {
                        return { done: true };
                    }
                    stopIteration = true;
                    return { done: false, value: buffer.text.cursorBack() };
                },
            };
        }
    },

    'l': {
        accepts: 'none',
        action: function l(buffer) {
            var stopIteration = false;
            return {
                next: function h() {
                    if (stopIteration) {
                        return { done: true };
                    }
                    stopIteration = true;
                    return { done: false, value: buffer.text.cursorForward() };
                },
            };
        }
    },

    'f': {
        accepts: 'literal',
        action: function (buffer, literal) {
            var stopIteration = false;

            return {
                next: function f() {
                    var val = buffer.text.cursorCurrent();

                    if (stopIteration) {
                        return { done: true };
                    }

                    stopIteration = val === literal;

                    buffer.text.cursorForward();

                    return { done: false, value: val };
                },
            };
        },
    },

    't': {
        accepts: 'literal',
        action: function (buffer, literal) {
            return {
                next: function t() {
                    var val = buffer.text.cursorCurrent();

                    if (val === literal) {
                        return { done: true };
                    }

                    buffer.text.cursorForward();

                    return { done: false, value: val };
                },
            };
        },
    },
};

module.exports.operators = {

    'd': {
        accepts: 'motion',
        action: function d(buffer, region) {
            var clip = [],
                next = region.next(),
                i;

            while (!next.done) {
                clip.push(next.value);
                next = region.next();
            }

            for (i = 0; i < clip.length; i += 1) {
                buffer.text.cursorBack();
                buffer.text.cut();
            }

            return clip;
        }
    },

};
