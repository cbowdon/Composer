/*jslint node: true */
'use strict';

module.exports = {
    listeners: { value: {} },

    addEventListener: {
        value: function (eventName, listener) {
            if (!this.listeners.hasOwnProperty(eventName)) {
                this.listeners[eventName] = [];
            }
            this.listeners[eventName].push(listener);
        }
    },

    fireListeners: {
        value: function (eventName, arg) {
            if (this.listeners.hasOwnProperty(eventName)) {
                this.listeners[eventName].forEach(function (listener) {
                    listener(arg);
                });
            }
        }
    }
};
