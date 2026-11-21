export function ProxyObject({onPropertySet = () => {}, target = {}, onGetMissing = null} = {}) {
	return new Proxy(target, {
		get: (obj, prop) => {
			if (!(prop in obj)) {
				if (onGetMissing != null) {
					return onGetMissing(prop)
				}
				return undefined
			}
			return obj[prop]
		},
		set: (obj, prop, value) => {
			obj[prop] = value
			onPropertySet(prop, value)
			return true
		},
		deleteProperty: () => {
			throw new Error("Deletion of keys is not allowed bitch")
		}
	})
}
