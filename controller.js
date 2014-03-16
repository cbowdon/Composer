(function (exports) {
    "use strict";

    exports.Controller = (function ControllerClosure() {

        function Controller() {
            this.currentBuffer = {
                state: [[]]
            };
        }

        Controller.prototype.runCommand = function Controller_runCommand(cmd) {
            throw new Error();
        };

        return Controller;
    }());

}(this));
