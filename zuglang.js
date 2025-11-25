
class ZuglangNumber {
    constructor(value) {
        this.value = value; // Store as decimal number
    }

    static fromString(str) {
        if (!/^[A-J]+$/.test(str)) {
            throw new Error("Invalid Zuglang number format. Use A-J.");
        }
        let decimal = 0;
        for (let i = 0; i < str.length; i++) {
            const digit = str.charCodeAt(i) - 'A'.charCodeAt(0);
            decimal = decimal * 10 + digit;
        }
        return new ZuglangNumber(decimal);
    }

    toString() {
        if (this.value === 0) return "A";
        let str = "";
        let num = Math.abs(this.value);
        while (num > 0) {
            const digit = num % 10;
            str = String.fromCharCode('A'.charCodeAt(0) + digit) + str;
            num = Math.floor(num / 10);
        }
        return this.value < 0 ? "-" + str : str;
    }
}

function calculate(aStr, bStr, operator) {
    const a = ZuglangNumber.fromString(aStr).value;
    const b = ZuglangNumber.fromString(bStr).value;
    let result;

    switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
            if (b === 0) throw new Error("Division by zero");
            result = Math.floor(a / b);
            break;
        default: throw new Error("Unknown operator");
    }

    return new ZuglangNumber(result).toString();
}

function decimalToZuglang(decimal) {
    return new ZuglangNumber(parseInt(decimal)).toString();
}

function zuglangToDecimal(zuglang) {
    return ZuglangNumber.fromString(zuglang).value;
}

function translate(text) {
    // Replace numbers with {Zuglang} and shift letters
    return text.replace(/\d+|[a-zA-Z]+/g, (match) => {
        if (/\d+/.test(match)) {
            // It's a number
            const zug = decimalToZuglang(match);
            return `{${zug}}`;
        } else {
            // It's a word/letters
            return match.split('').map(char => {
                if (char === 'z') return 'a';
                if (char === 'Z') return 'A';
                return String.fromCharCode(char.charCodeAt(0) + 1);
            }).join('');
        }
    });
}

function translateFromZuglang(text) {
    // Find {Zuglang} blocks and convert to decimal, shift other letters back
    return text.replace(/\{([A-J]+)\}|[a-zA-Z]+/g, (match, group1) => {
        if (group1) {
            // It matched {([A-J]+)}. group1 is the content.
            return zuglangToDecimal(group1);
        } else {
            // It matched [a-zA-Z]+ (outside of braces)
            return match.split('').map(char => {
                if (char === 'a') return 'z';
                if (char === 'A') return 'Z';
                return String.fromCharCode(char.charCodeAt(0) - 1);
            }).join('');
        }
    });
}

module.exports = { calculate, translate, translateFromZuglang, decimalToZuglang, zuglangToDecimal };
