const data = {}

export const G = new Proxy(data, {
	get(target, prop) {
		if (!(prop in target)) {
			target[prop] = Objects([])
		}
		return target[prop]
	},

	set(target, prop, value) {
		target[prop] = value
		return true
	}
})