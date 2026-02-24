export class Base {
    use(methods) {
        Object.assign(this.constructor.prototype, methods);
        return this;
    }
}

// Test Code
// Don't Include In Production
export const TestMixin = { 
    testFunc() {
        console.log("base class test success")
    }
}

export class TestClass extends Base {
    constructor() {
        super()
    }
}