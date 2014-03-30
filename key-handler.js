/*jslint node: true */
'use strict';

var $           = require('jquery'),
    publisher   = require('./publisher');

module.exports.KeyHandler = (function KeyHandlerClosure() {
    function convert(keyEvent) {
        var code = keyEvent.charCode,
            character;

        if (keyEvent.shiftKey) {
            code += 32;
        }

        character = String.fromCharCode(code);

        if (keyEvent.ctrlKey) {
            return '<C-' + character + '>';
        }
        if (keyEvent.metaKey) {
            return '<S-' + character + '>';
        }
        if (keyEvent.altKey) {
            return '<M-' + character + '>';
        }
        return character;
    }

    function KeyHandler(document) {
        var that = this;

        $(document).keypress(function (keyEvent) {
            var character = convert(keyEvent);
            keyEvent.preventDefault();
            that.fireListeners('input', character);
        });
    }

    Object.defineProperties(KeyHandler.prototype, publisher);

    return KeyHandler;
}());
