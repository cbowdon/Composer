/*jslint node: true */
'use strict';

module.exports.KeyHandler = (function KeyHandlerClosure() {

    function convert(keyEvent) {
        return 'z';
    }

    function KeyHandler(document) {
        this.listeners = {};

        document.addEventListener('keyup', function (keyEvent) {
            this.fireListeners('keypress', convert(keyEvent));
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

    return KeyHandler();
}());
