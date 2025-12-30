export function ProxyObject(object, onChange = () => {}) {
	return new Proxy(object, {
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
