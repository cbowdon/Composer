/*jslint node: true */
'use strict';

module.exports.motions = {

    'h': {
        accepts: 'none',
        action: function h(buffer) {
            return function () {
                return {
                    direction: 'back',
                    count: 1
                };
            };
        }
    },

    'l': {
        accepts: 'none',
        action: function l(buffer) {
            return function () {
                return {
                    direction: 'forward',
                    count: 1
                };
            };
        }
    },

    'j': {
        accepts: 'none',
        action: function j() {
            return function () {
                throw new Error();
            };
        }
    },

    'k': {
        accepts: 'none',
        action: function j() {
            return function () {
                throw new Error();
            };
        }
    },

    'f': {
        accepts: 'literal',
        action: function (buffer, literal) {
            return function () {
                return {
                    direction: 'forward',
                    count: 0
                };
            };
        }
    },

    't': {
        accepts: 'literal',
        action: function (buffer, literal) {
            return function () {
                return {
                    direction: 'forward',
                    count: 0
                };
            };
        }
    }
};

module.exports.operators = {

    'd': {
        accepts: 'motion',
        action: function d(buffer, region) {
            var clip = [], i;

            for (i = 0; i < region.count; i += 1) {
                clip.push(buffer.text.cut());
            }

            return clip;
        }
    }

};
