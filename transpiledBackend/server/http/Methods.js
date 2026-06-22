
export class Methods {

	static all = Object.create(null) // no prototype keys

	static add(path, callback) {
			Assert.notNull(path, 'param 1 - path - Methods.add')
			Assert.notNull(callback, 'param 2 - callback - Methods.add')
		if (path in this.all) {
			throw new Error(`route "${path}" already exists`)
		}
		else {
			this.all[path] = callback
		}
	}

	static call(path, args) {
			Assert.notNull(path, 'param 1 - path - Methods.call')
			Assert.notNull(args, 'param 2 - args - Methods.call')
		if (path in this.all) {
			try {
				return this.all[path](args)
			}
			catch (e) {
				console.log("ERROR: " + path)
				console.log(e)
				throw e
			}
		}
		else {
			throw new Error("not found")
		}
	}
}
