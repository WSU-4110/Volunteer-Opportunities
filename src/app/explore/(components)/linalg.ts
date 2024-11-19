export function add(a : number[], b : number[]) {
    return a.map((value, index) => value + b[index]);
}

export function pairwise_mult(a : number[], b : number[]) {
    return a.map((value, index) => value * b[index]);
}

export function dot(a : number[], b : number[]) {
    return pairwise_mult(a, b).reduce((prev, curr) => prev + curr);
}

export function scalar_mult(a : number, b : number[]) {
    return b.map((value) => a * value);
}

export function negate(a : number[]) {
    return a.map((value) => -value);
}

export function reverse(a : number[]) {
    return a.map((value, index) => a[a.length - 1 - index]);
}