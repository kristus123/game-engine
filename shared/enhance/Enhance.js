export function Enhance(prototype, name, fn, { allowInheritedOverride = false } = {}) {
	const prototypeName = prototype.constructor?.name ?? "anonymous"

	if (Object.prototype.hasOwnProperty.call(prototype, name)) {
		throw new Error(`ENHANCE ERROR: "${prototypeName}" already has field "${name}". cannot be overridden`)
	}
	else if (name in prototype && !allowInheritedOverride) {
		throw new Error(`ENHANCE ERROR: "${name}" is inherited by this prototype. set allowInheritedOverride to true to shadow it`)
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
