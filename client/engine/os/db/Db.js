export class Db {
	constructor(dbName) {
		this.lowDb = new LowDb(dbName)
	}

	save(e, callback=(x) => {}) {
		if (e._dbKey) {
			throw new Error("Cannot save an object which has an existing ._dbKey") // todo fix
		}
		else {
			// slight hack, but ok
			// used in LowDb.js and needs to be set here.
			e._dbKey = Random.uuid()

			this.lowDb.save(e, o => {
				callback(o)
			})
		}
	}

	update(e, callback=(x) => {}) {
		this.lowDb.update(e, callback)
	}

	get(key, callback) {
		this.lowDb.get(key, o => {
			callback(o)
		})
	}

	all(callback) {
		this.lowDb.all(cards => {
			callback(cards)
		})
	}

	random(callback) {
		this.lowDb.all(cards => {
			console.log(cards.empty)
			if (cards.empty) {
				console.log("no entries present when calling .random(), callback not triggered")
			}
			else {
				const c = Random.choice(cards)
				callback(c)
			}
		})
	}

	delete(e) {
		this.lowDb.delete(e._dbKey)
	}

	deleteAll() {
		this.lowDb.forEach(e => {
			this.lowDb.delete(e._dbKey)
		})
	}

	forEach(callback) {
		this.lowDb.forEach(e => {
			console.log(e)
			callback(e)
		})
	}
}
