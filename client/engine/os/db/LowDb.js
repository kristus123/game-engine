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

	get(_dbKey, callback) {
    	this.transaction("readonly", tx => {
        	const req = tx.objectStore(this.dbName).get(_dbKey)
        	req.onsuccess = () => callback(req.result)
        	req.onerror = e => {
            	throw new Error(`Get failed for _dbKey "${_dbKey}": ${e.target.error}`)
        	}
    	})
	}

	put(value, _dbKey, callback) {
    	this.transaction("readwrite", tx => {
        	const req = tx.objectStore(this.dbName).put(value, _dbKey)
        	req.onsuccess = () => callback && callback(req.result)

        	req.onerror = e => {
            	throw new Error(`Put failed for _dbKey "${_dbKey}": ${e.target.error}`)
        	}
    	})
	}

	delete(_dbKey, callback) {
    	this.transaction("readwrite", tx => {
        	const req = tx.objectStore(this.dbName).delete(_dbKey)
        	req.onsuccess = () => callback && callback(req.result)

        	req.onerror = e => {
            	throw new Error(`Delete failed for _dbKey "${_dbKey}": ${e.target.error}`)
        	}
    	})
	}

	all(callback) {
    	this.transaction("readonly", tx => {
			console.log(tx)
        	const store = tx.objectStore(this.dbName)
        	const results = []

        	const request = store.openCursor()

        	request.onsuccess = e => {
            	const cursor = e.target.result
            	if (cursor) {
                	results.push(DbObject(this, cursor.value))
                	cursor.continue()
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


}
