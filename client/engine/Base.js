export class Base {
	use(methods) {
    	Object.assign(this.constructor.prototype, methods)
    	return this
	}
}