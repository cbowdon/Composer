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

_What type of action is that?_
- The **c** action is a **verb**.
- The **c** action has a **accepts** property that is **noun**.

_What do we have to do?_
- Put the action on the stack.
- Await further input of type **noun**.

#### I've pressed the 't' key

- The shim translates { keyCode: 70 }  to... 't'

_What mode are we in?_
- We're in normal mode, direct to normal handler.

_Is the action stack empty?_
- No. The **c** verb is at the top of the stack.

_What kind of argument does the action at the top of the stack accept?_
- A **noun**.
- Lookup **t** in the nouns dictionary.

_Is that a complete action?_
- No. The **t** action has a **accepts** property that is **literal**.

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

**...**
