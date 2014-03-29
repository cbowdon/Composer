/*jslint node: true */
'use strict';

var publisher = require('./publisher');

module.exports.KeyHandler = (function KeyHandlerClosure() {
    function convert(keyEvent) {
        var code = keyEvent.keyCode,
            character;
        if (keyEvent.shiftKey) {
            code += 32;
        }
        character = String.fromCharCode(code);
        return keyEvent.ctrlKey ?
            '<C-' + character + '>' :
            character;
    }

    function KeyHandler(document) {
        var that = this;

        publisher.call(this);

        document.addEventListener('keyup', function (keyEvent) {
            var character = convert(keyEvent);
            console.log(keyEvent, character);
            that.fireListeners('input', character);
        });

    }

    return KeyHandler;
}());
