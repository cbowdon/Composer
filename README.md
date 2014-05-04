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

### Roadmap
Agile - release a turd, then polish. Paraphrasing slightly.

* v0.0.x
- Insert mode.
- Basic GUI, keyboard input setup.

* v0.1.x
- Adds normal mode cursor movement.

* v0.2.x
- Adds normal mode operators like change and delete.

* v0.3.x
- Adds command mode.

* v0.4.x
- Adds multiple buffers.

### Architecture

Sort of a multi-interpreter Emacs:

+ Key handler (shim to convert e.g. browser keys to standard)
- Mode manager (manages which interpreter we are using)
- Interpreters (insert, normal, visual, custom)
- Subeditor environment (available as API to interpreters)
    - The Buffer router (manages multiple buffers)
        - Buffers
    - Functions library
+ Redisplay code
