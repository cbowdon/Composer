# Composer

The idea is to make an editor that:

- has a (very) Vim-like command language
- is easily extensible (i.e. with JavaScript modules)
- can be embedded in web pages (i.e. it's written in JS)
- is fun to write!

## Planning

### Some design principles
- I want the engine to be as independent as possible.
- Modules, modules everywhere.
- No special care to be paid to encapsulation. Makes too much noise in JS. Python's "we're all consenting adults approach" will be fine.
- Minimal dependencies whilst not re-inventing the wheel.
- Immutable data and functional approach to be default: OO and mutable state to be wheeled out when beneficial.
- ES5, no messing around with TypeScript today.

### Flow...

* Host application
    - Provides the display.
    - Captures keyboard input.
* Command interpreter
    - Matches input key(s) to a command.
    - Has some reference to user-defined extension functions.
    - Rejects bad input.
* Controller
    - Contains multiple buffers, understands commands to change between them, add new, etc.
    - Contains the macro registers.
    - Contains the yank registers.
    - Passes any other commands directly to the...
* Buffer
    - Accepts commands and returns the effect this has on buffer state.
    - Makes the entire buffer available to read.
    - Stores marks.
    - Stores the sequence of commands and effects.
    - Stores cursor location/highlights.

So something like...

    host.keyPressEventHandler(key => {
        let bufferChanges = commandInterpreter.input(key)
        host.bufferUI.applyChange(bufferChanges);
    });

    ...

    commandInterpreter.input = key => {
        stack.push(key);
        let cmd = commands.lookup(stack);
        return cmd.isComplete ?
            controller.runCommand(cmd) :
            noChange;
    }

    ...

    controller.runCommand = cmd => {
        if (isMacroStop(cmd)) {
            isMacroRecording = false;
        }
        if (isMacroStart(cmd)) {
            currentMacroRegister = registers[cmd.registerName];
            currentMacroRegister = [];
        }
        if (isMacroRecording) {
            currentMacroRegister.push(cmd);
        }
        if (isBufferCmd(cmd)) {
            bufferContainer.runCommand(cmd);
            return currentBuffer;
        }
        return cmd(currentBuffer);
    }
