/*jslint node: true */
'use strict';

module.exports = function publisher() {
    this.listeners = {};

    this.addEventListener = function (eventName, listener) {
      if (!this.listeners.hasOwnProperty(eventName)) {
          this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(listener);
    };

    this.fireListeners = function (eventName, arg) {
        if (this.listeners.hasOwnProperty(eventName)) {
            this.listeners[eventName].forEach(function (listener) {
                listener(arg);
            });
        }
    };

    return this;
};
