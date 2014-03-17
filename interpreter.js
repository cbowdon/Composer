(function (exports) {
    'use strict';

    exports.Interpreter = (function InterpreterClosure() {

        function insert(character) {
            return function (buffer) {
                buffer.atCursor = character;
                buffer.cursor.increment();
                return buffer;
            };
        }

        var modeChange = {
            '<ESC>': function modeChange_ESC(buffer) {
                buffer.mode = 'normal';
                return buffer;
            },
            'i': function modeChange_i(buffer) {
                buffer.mode = 'insert';
                return buffer;
            },
        };

        var regions = {
            'l': function regions_w(buffer) {
                buffer.increment();
                return buffer;
            }
        };

        var actions = {
            'c': function actions_c(region) {
                return function (buffer) {
                    buffer.clear(region);
                    buffer.mode = 'insert';
                    return buffer;
                };
            }
        };

        function Interpreter(controller) {
            this.controller = controller;
            this.stack = [];
        }

        Interpreter.prototype.input = function (key) {
            var command;

            if (this.controller.currentBuffer.mode === 'insert') {
                if (key === '<ESC>') {
                    return this.controller.runCommand(modeChange[key]);
                }
                return this.controller.runCommand(insert(key));
            }

            this.stack.push(key);

            command = this.checkStack();

            if (command.complete) {
                this.stack = [];
            }

            return command;
        };

        Interpreter.prototype.checkStack = function () {

            throw new Error();
        };

        return Interpreter;
    }());

}(this));
