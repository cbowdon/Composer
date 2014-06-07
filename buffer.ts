interface Option<T> {
    success: boolean;
    value?: T;
}

function some<T>(value: T): Option<T> {
    return Object.freeze({ success: true, value: value });
}

function none<T>(): Option<T> {
    return Object.freeze({ success: false });
}

function repeat(count, func) {
    var i, result = [];
    for (i = 0; i < count; i += 1) {
        result.push(func());
    }
    return result;
}

interface ReadBuffer {
    toString(): string;
    charAt(number): Option<string>;
}

interface WriteBuffer {

    insert(string): Option<number>;
    cut(number): Option<string>;

    forward(number): Option<number>;
    back(number): Option<number>;

    update(string): Option<string>;
}

interface Buffer extends ReadBuffer, WriteBuffer {
}

class GapBuffer implements ReadBuffer {

    private before: string[];
    private after: string[] = [null];

    constructor(text: string) {
        this.load(text);
    }

    load(text: string) {
        this.after = text
            .split('')
            .concat([null])
            .reverse();
    }

    charAt(index): Option<string> {
        if (index < 0) {
            return none<string>();
        }

        if (index < this.before.length) {
            return some(this.before[index]);
        }

        if (index >= (this.before.length + this.after.length)) {
            return none<string>();
        }

        return some(this.after[this.after.length - 1 - (index - this.before.length)]);
    }

    toString() {
        return this.before
            .concat(this.after.slice(0).reverse())
            .join('');
    }

    forward(count) {
        var n = count === 0 ? 0 : count || 1;

        return repeat(n, function () {

            if (this.after.length === 1) {
                return { success: true, value: null };
                // but don't actually pop the null terminator
            }

            this.before.push(this.after.pop());

            return this.current();
        }).pop();
    }

    back(count) {
        var n = count === 0 ? 0 : count || 1;

        return repeat(n, function () {

            if (this.before.length === 0) {
                return { success: false };
            }

            this.after.push(this.before.pop());

            return this.current();
        }).pop();
    }

    cut() {
        return this.before.length === 0 ?
                { success: false } :
                { success: true, value: this.before.pop() };
    }

    insert(character) {
        return { success: true, value: this.before.push(character) };
    }

    update(character) {
        var popped;
        if (this.after.length === 1) {
            return { success: false };
        }
        popped = this.after.pop();
        this.after.push(character);
        return { success: true, value: popped };
    }

    private isSingleChar(c: string) {
        return c.length === 1;
    }

    private current() {
        if (this.after.length === 0) {
            return { success: false };
        }
        return { success: true, value: this.after[this.after.length - 1] };
    }

    private cursorPosition() {
        return this.before.length;
    }
}
