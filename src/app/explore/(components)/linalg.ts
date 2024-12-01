export class Vector {
    v : number[]

    constructor(v : number[]) {
        this.v = v;
    }

    add(b : Vector) {
        if (this.v.length !== b.v.length) {
            throw new Error("Dimension of v doesn't match dimension of b");
        }

        return new Vector(this.v.map((value, index) => value + b.v[index]));
    }
    
    pairwise_mult(b : Vector) {
        if (this.v.length !== b.v.length) {
            throw new Error("Dimension of v doesn't match dimension of b");
        }

        return new Vector(this.v.map((value, index) => value * b.v[index]));
    }
    
    dot(b : Vector) {
        if (this.v.length !== b.v.length) {
            throw new Error("Dimension of v doesn't match dimension of b");
        }
        
        if (this.v.length === 0) {
            return 0;
        }

        return this.pairwise_mult(b).v.reduce((prev, curr) => prev + curr);
    }
    
    scalar_mult(a : number) {
        return new Vector(this.v.map((value) => a * value));
    }
    
    negate() {
        return new Vector(this.v.map((value) => -value));
    }
    
    reverse() {
        return new Vector(this.v.map((value, index) => this.v[this.v.length - 1 - index]));
    }
}
