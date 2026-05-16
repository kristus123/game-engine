export class Methods {

	static all = Object.create(null) // no prototype keys

	static add(path, callback) {
		if (path in this.all) {
			throw new Error(`route "${path}" already exists`)
		}
		else {
			this.all[path] = callback
		}
	}

	static call(path, args) {
		if (path in this.all) {
			return this.all[path](args)
		}
		else {
			throw new Error("not found")
		}
	}
}
