export class LowDb {

	constructor(dbName) {
		this.dbName = dbName
		this.db = null
		this.ready = false

		const request = indexedDB.open(this.dbName)

		request.onupgradeneeded = (e) => {
			this.db = request.result
			if (!this.db.objectStoreNames.contains(this.dbName)) {
				this.db.createObjectStore(this.dbName)
			}
			if (this.onUpgradeNeeded) {
				this.onUpgradeNeeded(this.db, e)
			}
		}

		request.onsuccess = () => {
			this.db = request.result
			this.ready = true
		}

		request.onerror = (e) => {
			throw new Error("IndexedDB failed to open: " + e.target.error)
		}
	}

	_waitReady(callback) {
		if (this.ready) {
			callback(this.db)
		}
		else {
			setTimeout(() => {
				this._waitReady(callback)
			}, 50)
		}
	}

	transaction(mode, callback) {

		this._waitReady(db => {
			const tx = db.transaction(this.dbName, mode)

			tx.onerror = e => {
				throw new Error(`Transaction failed: ${e.target.error}`)
			}
			tx.onabort = e => {
				throw new Error(`Transaction aborted: ${e.target.error}`)
			}

			callback(tx)
		})
	}

	get(dbKey, callback) {
		this.transaction("readonly", tx => {
			const r = tx.objectStore(this.dbName).get(dbKey)
			r.onsuccess = () => callback(r.result)
			r.onerror = e => {
				throw new Error(`Get failed for dbKey "${dbKey}": ${e.target.error}`)
			}
		})
	}

	save(o, callback = (x) => {}) {
		Assert.notNull(o)
		Assert.notNull(o._dbKey)

		this.transaction("readwrite", tx => {
			const r = tx.objectStore(this.dbName).put(o, o._dbKey)

			r.onsuccess = () => {
				callback(o)
			}

			r.onerror = e => {
				throw new Error(`Put failed": ${e.target.error}`)
			}
		})
	}

	update(o, callback = (x) => {}) {
		// Assert that the object and _dbKey exist
		Assert.notNull(o, "Object cannot be null")
		Assert.notNull(o._dbKey, "o._dbKey cannot be null")

		this.transaction("readwrite", tx => {
			const store = tx.objectStore(this.dbName)

			const getRequest = store.get(o._dbKey)

			getRequest.onsuccess = () => {
				if (getRequest.result === undefined) {
					throw new Error(`Update failed: no entry found with dbKey "${o._dbKey}"`)
				}
				else {
					const putRequest = store.put(o, o._dbKey)
					putRequest.onsuccess = () => callback(o)
					putRequest.onerror = e => {
						throw new Error(`Update failed for dbKey "${o._dbKey}": ${e.target.error}`)
					}
				}
			}

			getRequest.onerror = e => {
				throw new Error(`Failed to check existence of dbKey "${o._dbKey}": ${e.target.error}`)
			}
		})
	}

	delete(dbKey) {
		Assert.notNull(dbKey, "dbKey cannot be null")
		this.transaction("readwrite", tx => {
			const r = tx.objectStore(this.dbName).delete(dbKey)
			// r.onsuccess = () => callback && callback(r.result) // maybe add later

			r.onerror = e => {
				throw new Error(`Delete failed for dbKey "${dbKey}": ${e.target.error}`)
			}
		})
	}

	all(callback) {
		this.transaction("readonly", tx => {
			const store = tx.objectStore(this.dbName)
			const results = []

			const request = store.openCursor()

			request.onsuccess = e => {
				const c = e.target.result
				if (c) {
					results.push(c.value)
					c.continue()
				}
				else {
					callback(results)
				}
			}

			request.onerror = e => {
				throw new Error(`Failed to iterate store "${this.dbName}": ${e.target.error}`)
			}
		})
	}

	forEach(callback) {
		this.all(items => {
			for (const i of items) {
				callback(i)
			}
		})
	}

}
