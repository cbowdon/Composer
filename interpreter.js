(function (exports) {
    "use strict";

    exports.Interpreter = (function InterpreterClosure() {

        function Interpreter(controller) {
            this.controller = controller;
        }

        Interpreter.prototype.input = function (keys) {
            throw new Error();
        };

        return Interpreter;
    }());

}(this));
