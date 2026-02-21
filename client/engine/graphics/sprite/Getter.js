export function Getter(obj, getterName, arrowFunction) {
	if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
		throw new TypeError("First argument must be an object or function")
	}
	else if (typeof getterName !== "string" && typeof getterName !== "symbol") {
		throw new TypeError("getterName must be a string or symbol")
	}
	else if (typeof arrowFunction !== "function") {
		throw new TypeError("Third argument must be a function")
	}
	else if (getterName in obj) {
		throw new Error(`Cannot define getter "${String(getterName)}": property already exists`)
	}
	else {
		Object.defineProperty(obj, getterName, {
			get: arrowFunction,
			enumerable: false,
			configurable: false,
		})
	}
}
