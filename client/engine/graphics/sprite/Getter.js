export function Getter(obj, getterName, arrowFunction) {
	if (obj == null || (typeof obj != "object" && typeof obj != "function")) {
		throw new Error("First argument must be an object or function")
	}

	Assert.string(getterName)
	Assert.method(arrowFunction)

	let p

	if (typeof obj === "function" && obj.prototype) {
		p = obj.prototype
	}
	else if (typeof obj === "object") {
		p = Object.getPrototypeOf(obj)
		if (!p) {
    		throw new Error("Cannot determine prototype for this object")
		}
	}
	else {
		throw new TypeError("Cannot attach getter to this type")
	}

	if (getterName in p) {
		throw new Error(`Cannot define getter "${String(getterName)}": property already exists`)
	}

	Object.defineProperty(p, getterName, {
		get: arrowFunction,
		enumerable: false,
		configurable: false,
	})
}
