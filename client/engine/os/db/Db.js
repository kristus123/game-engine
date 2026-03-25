export class Db {
	constructor(storeName) {
		this.db = null
		this.ready = false

		const r = indexedDB.open("game-engine-db", 1)

		r.onupgradeneeded = () => {
			r.result.createObjectStore(this.storeName)
		}

		r.onsuccess = () => {
			this.db = r.result
			this.ready = true
		}
	}

	execute(callback) {
		const check = () => {
			if (this.ready) {
				callback(this.db)
			}
			else {
				setTimeout(check, 50)
			}
		}

		check()
	}

	save(o) {
		if (o.key) {
			throw new Error("Sorry. you can't save an object to Db.js if o.key is present")
		}

		const key = Random.uuid()

		o.key = key

		this.execute(db => {
			const t = db.transaction(this.storeName, "readwrite")
			const store = t.objectStore(this.storeName)
			const req = store.put(o, key)

			req.onerror = () => {
				throw new Error("Failed to save data: " + req.error)
			}
		})

		return o // needs to match .forEach 
	}

	// get(key, callback) {
	// 	this.execute(db => {
	// 		const txx = db.transaction(this.storeName, "readonly")
	// 		const req = txx.objectStore(this.storeName).get(key)
	// 		req.onsuccess = () => callback(req.result)
	// 	})
	// }

	delete(obj) {
		this.execute(db => {
			const t = db.transaction(this.storeName, "readwrite")
			t.objectStore(this.storeName).delete(obj.key)
		})
	}

	deleteAll() {
		this.all(elements => {
			for (const e of elements) {
				this.delete(e)
			}
		})
	}

	all(callback) {
		this.execute(db => {
			const tx = db.transaction(this.storeName, "readonly")
			const store = tx.objectStore(this.storeName)
			const result = []
			store.openCursor().onsuccess = e => {
				const cursor = e.target.result
				if (cursor) {
					result.push({ key: cursor.key, value: cursor.value })
					cursor.continue()
				}
				else {
					callback(result)
				}
			}
		})
	}

	forEach(callback) {
		this.all(cards => {
			for (const c of cards) {
				c.value.delete = () => {
					this.delete(c.value)
				}
				callback(c.value)
			}
		})
	}

}

