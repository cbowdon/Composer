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
* Key input shim
    - Translates between the key defs (e.g. <ESC>) and the host (e.g. browser events)
* Mode controller
    - Contains the macro registers.
    - Contains the yank registers.
* Mode intercepter
    - Gets first look at input
* Command interpreter
    - Matches input key(s) to a command.
    - Has some reference to user-defined extension functions.
    - Rejects bad input.
* Buffer router
    - Contains multiple buffers, understands commands to change between them, add new, etc.
    - Passes any other commands directly to the...
* Buffer
    - Accepts commands and returns the effect this has on buffer state.
    - Makes the entire buffer available to read.
    - Stores marks.
    - Stores the sequence of commands and effects.
    - Stores cursor location/highlights.


### Scenarios

#### I've pressed the 'i' key

- The shim translates { keyCode: 65 }  to... 'i'

_What mode are we in?_
- We're in normal mode, direct to normal handler.

_Is the action stack empty?_
- Yes, lookup the **i** action (an object).

_Is that a complete action?_
- The **i** action has a **complete** property that is **true** (or equivalent).

_What does the action have to do?_
- Change the mode, only.
- The object has an **action** property that is a function to do this.

**...**

#### I've pressed the 'c' key

- The shim translates { keyCode: 58 }  to... 'c'

_What mode are we in?_
- We're in normal mode, direct to normal handler.

_Is the action stack empty?_
- Yes, lookup the **c** action (an object).

_Is that a complete action?_
- The **c** action has a **complete** property that is **false** (or equivalent).
- The **c** action has a **accepts** property that is **action**.

_What do we have to do?_
- Put the action on the stack.
- Await further input of type **action**.

#### I've pressed the 't' key

- The shim translates { keyCode: 70 }  to... 't'

_What mode are we in?_
- We're in normal mode, direct to normal handler.

_Is the action stack empty?_
- No. The **c** action is at the top of the stack.

_What kind of argument does the action at the top of the stack accept?_
- An **action**.
- Lookup the **t** action (an object).

_Is that a complete action?_
- The **t** action has a **complete** property that is **false** (or equivalent).
- The **t** action has a **accepts** property that is **literal**.

_What do we have to do?_
- Put the action on the stack.
- Await further input of type **literal**.

#### I've pressed the 'x' key

- The shim translates { keyCode: 80 }  to... 'x'

_What mode are we in?_
- We're in normal mode, direct to normal handler.

_Is the action stack empty?_
- No. The **t** action is at the top of the stack.

_What kind of argument does the action at the top of the stack accept?_
- A **literal**.
- Accept **x** as a literal.

_Is that a complete action?_
- Literals are always complete.

_What do we have to do?_
- Let's evaluate the stack!
- **t** is on top, accepting an argument of **x** (literal).
- Evaluate **t('x')** - it returns a region.
- Pass this region to the next item on the stack, **c**.
- Evaluate **c(t('x'))**.

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
