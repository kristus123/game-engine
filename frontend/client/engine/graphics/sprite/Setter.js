export function Setter(prototype, name, { get, set }) {

	Assert.value(prototype)
	Assert.string(name)

	Assert.method(get)
	Assert.method(set)

	if (name in prototype) {
		throw new Error(`field "${name}" already exists`)
	}

	Object.defineProperty(prototype, name, {
		get,
		set,
		enumerable: false,
		configurable: false,
	})
}
