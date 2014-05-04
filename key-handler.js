/*jslint node: true */
'use strict';

var $           = require('jquery'),
    publisher   = require('./publisher');

exports.KeyHandler = (function KeyHandlerClosure() {

    function convert(keyEvent) {
        var code = keyEvent.charCode,
            key  = keyEvent.key,
            character;

        if (code === 0) {
            return key === 'Enter' ?  '<CR>' : '<' + key + '>';
        }

        character = String.fromCharCode(code);

        if (keyEvent.ctrlKey && keyEvent.altKey) {
            return '<C-M-' + character + '>';
        }
        if (keyEvent.ctrlKey) {
            return '<C-' + character + '>';
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
            //console.log(character, keyEvent.key, keyEvent.charCode, keyEvent);
            if (!keyEvent.metaKey) {
                keyEvent.preventDefault();
            }
            that.fireListeners('input', character);
        });
    }

    Object.defineProperties(KeyHandler.prototype, publisher);

    return KeyHandler;
}());
