export function Getter(proto, name, fn) {
	if (!proto || (typeof proto !== "object" && typeof proto !== "function")) {
		throw new Error("First argument must be a prototype object")
	}

	Assert.string(name)
	Assert.method(fn)

	if (name in proto) {
		throw new Error(`Getter "${name}" already exists`)
	}

	Object.defineProperty(proto, name, {
		get: fn,
		enumerable: false,
		configurable: false,
	})
}
