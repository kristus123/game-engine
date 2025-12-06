export class Db {
	constructor(dbName, storeName) {
		this.db = null
		this.ready = false

		const r = indexedDB.open(this.dbName, 1)

		r.onupgradeneeded = () => {
			r.result.createObjectStore(this.storeName)
		}

		r.onsuccess = () => {
			this.db = r.result
			this.ready = true
		}
	}

	_onReady(callback) {
		const check = () => {
			if (this.ready) {
				callback(this.db)
			}
			else {
				setTimeout(check, 10)
			}
		}

		check()
	}

	save(key, blob) {
		this._onReady(db => {
			const tx = db.transaction(this.storeName, 'readwrite')
			const store = tx.objectStore(this.storeName)
			const req = store.put(blob, key)
			req.onerror = () => {
				throw new Error('Failed to save data: ' + req.error)
			}
		})
	}

	get(key, callback) {
		this._onReady(db => {
			const tx = db.transaction(this.storeName, 'readonly')
			const req = tx.objectStore(this.storeName).get(key)
			req.onsuccess = () => callback(req.result)
		})
	}

	delete(key) {
		this._onReady(db => {
			const tx = db.transaction(this.storeName, 'readwrite')
			tx.objectStore(this.storeName).delete(key)
		})
	}

	all(callback) {
		this._onReady(db => {
			const tx = db.transaction(this.storeName, 'readonly')
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

