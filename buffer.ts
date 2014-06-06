interface Option<T> {
    success: boolean;
    value?: T;
}

function some<T>(value: T): Option<T> {
    return { success: true, value: value };
}

function none<T>(): Option<T> {
    return { success: false };
}

interface Reversible<T, U> {
    (character: T): U;
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
}
