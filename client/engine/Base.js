export class Base { // should be moved to SuperClass instead
	use(methods) {
		Object.assign(this.constructor.prototype, methods)
		return this
	}
}
