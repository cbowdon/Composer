(function (exports) {
    'use strict';

    exports.Interpreter = (function InterpreterClosure() {

        function Interpreter(controller) {
            this.controller = controller;
            this.stack = [];
        }

        Interpreter.prototype.input = function (keys) {
            var that = this;
            if (typeof keys.forEach === 'function') {
                keys.forEach(function (key) {
                    that.stack.push(key);
                });
            }
            this.stack.push(keys);

            return this.lookup(this.stack);
        };

        Interpreter.prototype.lookup = function (stack) {
            throw new Error();
        };

        return Interpreter;
    }());

}(this));
