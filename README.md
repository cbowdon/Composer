# Composer

The idea is to make an editor that:

- has a (very) Vim-like command language
- is easily extensible (i.e. with JavaScript modules)
- can be embedded in web pages (i.e. it's written in JS)
- is fun to write!

**Update**
Having discovered CodeMirror and ACE, I've concluded this project. Review is at the bottom.

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
- Subeditor environment (consumes interpreter's output)
    - The Transaction Manager (Writer of actions, undos, redos)
    - The Buffer Router (manages multiple buffers)
        - Buffers
            - Registers
            - Cursor
            - History/undo
    - Functions libraries
+ Redisplay

### Buffer history (undo functionality)
Best plan for this I can think of:
- all actions are compositions of a few reversible core actions
- interpreters produce an array of these actions to enact the user's command
- these are saved as a transaction
- undoing a transaction is simply reversing all the core actions within
- reversible core actions are (probably):
    + cursor forward/back
    + insert
    + cut
    + update
- potentially a mini-DSL? e.g. [
    { cut: 1 }
    { insert: 'h' }
    { forward: 5 }
]

## Conclusion
Well, I discovered CodeMirror, which does roughly the same and is so much more sophisticated it's humiliating. Since there's no possible gain by carrying on, I'm going to wrap this one up. (Ok, so it would be fun to carry on. But there's other projects that would be fun.).

A quick review of this project then, a what-have-we-learned:

* The gap buffer was a mistake. After some research, I selected it for its strength is as a relatively simple and efficient data structure. However, implementing it cost a lot of time for no noticeable performance gain _at this stage_. CodeMirror's original data structure was an array of strings, and that served very well until their version 2, when they switched to a derivative of a B-tree. Not using an array of strings was a classic violation of the first rule of optimization, and I hang my head in shame. I might have profitably switched to a gap buffer later (or an array of gap buffers) but starting with it was a mistake.

* JavaScript is such a flexible beast it's both a delight and a challenge. Delightful to find you can easily create a DSL, challenging to always know the right way to write something. Conventions and trusty old JSLint help, but there's still ambiguous situations.

* I abandoned two of my design principles:
    - Avoiding mutable state was forgotten early on. This isn't Yi, it's not using a finger tree, and the functional+_immutable_ style is not supported by ES5. Maybe ES6 will with its **const** keyword but even then I imagine that's like a const reference rather than a true immutable object. So yeah, never mind.
    - I was about to start messing around with TypeScript. I originally was against it because I didn't want the weight of a new language, but honestly that's hardly an issue with TypeScript (assuming you know JavaScript and C#). Most of all, static types + type inference are the best way to write clean, maintainable code. Next time I'm _starting_ with TypeScript.

* CodeMirror seems to make an efficient editor from DOM elements, whereas my naive approach with HTML tables was hideously slow and I had better results just drawing to the canvas. Not sure how they managed that, but the result is better because you can easily style it with CSS. (I was considering some kind of module for looking up styles and copying them to the canvas, but that's not likely to be as good.)

* I think the architectural approach was right. Adding new interpreters and library functions would've been straightforward, plus it was quite testable. Avoiding tight coupling between the buffer and the rest of the application was the biggest challenge and having interpreters produce a set of instructions in a mini editing language achieves that. Having a few core reversible actions that all other actions are composed of makes implementing undo a lot easier too. But primarily, it makes testing the interpreters really simple. Rather than setting up a buffer and checking its state after, we can just check that feeding the interpreter command X produces instruction set Y.

* Composer was a rubbish name.

Although nothing like as good as CodeMirror, I did successfully make a very basic text editor from scratch, so overall not too bad.
