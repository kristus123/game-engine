export function ProxyObject(onChange = () => {}, target = {}, onGetMissing = null) {
	return new Proxy(target, {
		get: (obj, prop) => {
			if (!(prop in obj)) {
				if (onGetMissing != null) {
					return onGetMissing(prop)
				}
				return (...args) => {
					return onChange(prop, ...args)
				}
			}
			return obj[prop]
		},
		set: (obj, prop, value) => {
			obj[prop] = value
			onChange(prop, value)
		},
		deleteProperty: () => {
			throw new Error("Deletion of keys is not allowed bitch")
		}
	})
}
