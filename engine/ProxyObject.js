export function ProxyObject(object, onChange = () => {}) {
	return new Proxy(object, {
		get: (obj, prop) => {
			if (!(prop in obj)) {
		            	return (...args) => {
                			return onChange(prop, ...args)
		            	}
			}
			return obj[prop]
		},
		set: (obj, prop, value) => {
			obj[prop] = value
			onChange(prop, value)
			return true
		},
		deleteProperty: () => {
			throw new Error('Deletion of keys is not allowed bitch')
		}
	})
}

