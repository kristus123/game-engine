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

	save(blob) {
		const key = Random.uuid()

		this.execute(db => {
			const tx = db.transaction(this.storeName, "readwrite")
			const store = tx.objectStore(this.storeName)
			const req = store.put(blob, key)
			req.onerror = () => {
				throw new Error("Failed to save data: " + req.error)
			}
		})

		return key
	}

	get(key, callback) {
		this.execute(db => {
			const tx = db.transaction(this.storeName, "readonly")
			const req = tx.objectStore(this.storeName).get(key)
			req.onsuccess = () => callback(req.result)
		})
	}

	delete(key) {
		this.execute(db => {
			const tx = db.transaction(this.storeName, "readwrite")
			tx.objectStore(this.storeName).delete(key)
		})
	}

	deleteAll() {
		this.all(elements => {
			for (const e of elements) {
				this.delete(e.key)
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


}

