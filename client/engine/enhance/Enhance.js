export function Enhance(target, name, fn) {

	const proto = target.prototype

	if (Object.prototype.hasOwnProperty.call(proto, name)) {
		throw new Error(`ENHANCE ERROR: "${target.name}" already has field "${name}". cannot be overridden`)
	}
	else {
		Object.defineProperty(proto, name, {
			value: fn,
			writable: true,
			configurable: true,
			enumerable: false,
		})
	}
}
