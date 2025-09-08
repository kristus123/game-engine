export class AudioDb {
	static dbName = 'audioDB'
	static storeName = 'clips'
	static db = null
	static ready = false

	static {
		const req = indexedDB.open(this.dbName, 1)
		req.onupgradeneeded = () => req.result.createObjectStore(this.storeName)
		req.onsuccess = () => {
  	this.db = req.result
  	this.ready = true
		}
	}

	static _onReady(callback) {
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

	static save(key, blob) {
		this._onReady(db => {
  	const tx = db.transaction(this.storeName, 'readwrite')
  	tx.objectStore(this.storeName).put(blob, key)
		})
	}

	static load(key, callback) {
		this._onReady(db => {
  	const tx = db.transaction(this.storeName, 'readonly')
  	const req = tx.objectStore(this.storeName).get(key)
  	req.onsuccess = () => callback(req.result)
		})
	}

	static delete(key) {
		this._onReady(db => {
  	const tx = db.transaction(this.storeName, 'readwrite')
  	tx.objectStore(this.storeName).delete(key)
		})
	}

}

