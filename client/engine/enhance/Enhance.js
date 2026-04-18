export function Enhance(prototype, name, fn) {

	if (Object.prototype.hasOwnProperty.call(prototype, name)) {
		throw new Error(`ENHANCE ERROR: "${prototype.name}" already has field "${name}". cannot be overridden`)
	}
	else {
		Object.defineProperty(prototype, name, {
			value: fn,
			writable: true,
			configurable: true,
			enumerable: false,
		})
	}
}
