export function Getter(prototype, name, fn) {

	Assert.value(prototype)
	Assert.string(name)
	Assert.method(fn)

	if (name in prototype) {
		throw new Error(`field "${name}" already exists`)
	}

	Object.defineProperty(prototype, name, {
		get: fn,
		enumerable: false,
		configurable: false,
	})
}
