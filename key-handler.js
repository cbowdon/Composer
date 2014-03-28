/*jslint node: true */
'use strict';

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
        this.listeners = {};

        document.addEventListener('keyup', function (keyEvent) {
            var character = convert(keyEvent);
            console.log(keyEvent, character);
            that.fireListeners('input', character);
        });
    }

    KeyHandler.prototype.addEventListener = function (eventName, listener) {
        if (!this.listeners.hasOwnProperty(eventName)) {
            this.listeners.eventName = [];
        }
        this.listeners.eventName.push(listener);
    };

    KeyHandler.prototype.fireListeners = function (eventName, arg) {
        if (this.listeners.hasOwnProperty(eventName)) {
            this.listeners.eventName.forEach(function (listener) {
                listener(arg);
            });
        }
    };

    return KeyHandler;
}());
