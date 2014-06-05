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
- "Make it work, then make it good." (Refactor later, explore the problem first.)
- ES5, no messing around with TypeScript today.
- Firefox support only. Add proper cross-browser support later.

### Roadmap
MVP etc. etc.

Key
---
* Version
+ Denotes user-facing features.
- Denotes internal features.
---

* v0.0.x **DONE**
+ Insert mode.
+ Basic GUI, keyboard input setup.

* v0.1.x **IN PROGRESS**
+ Adds normal mode cursor movement.
+ Adds undo.
- Testable interpreters.
- Migrate to TypeScript? Or start using Mocha + Blanket for code coverage? Both?

* v0.2.x
+ Adds normal mode operators like change and delete.
+ Adds copy-paste.
- Adds extensible lib.

* v0.3.x
+ Adds command mode.

* v0.4.x
+ Adds multiple buffers.

* v0.5.x
+ Evil: adds (optional) JS eval mode

* v0.6.x
+ Support for other browsers.

### Architecture

Sort of a multi-interpreter Emacs:

+ Key handler (shim to convert e.g. browser keys to standard)
- Mode manager (manages which interpreter we are using)
- Interpreters (insert, normal, visual, custom)
- Subeditor environment (available as API to interpreters)
    - The Buffer router (manages multiple buffers)
        - Buffers
            - Registers
            - Cursor
            - History/undo
    - Functions libraries
+ Redisplay

### Buffer history (undo functionality)
Best plan for this I can think of:
- all actions are compositions of a few reversible core actions
- every action is saved as transaction containing said core actions
- undoing a transaction is simply reversing all the core actions within
- reversible core actions are (probably):
    + cursor forward/back
    + insert
    + cut
    + read (a no-op when undoing)
- potentially a mini-DSL? Looking a bit like assembly.
