export class Db {
	constructor(dbName) {
    	this.db = new LowDb(dbName)
	}

	save(o) {
    	if (o.key) {
        	throw new Error("Cannot save object with existing key")
    	}

    	const key = Random.uuid()
    	o.key = key

    	this.db.put(o, key)

    	return DbObject(this.db, o)
	}

	get(key, callback) {
    	this.db.get(key, callback)
	}

	delete(obj) {
    	this.db.delete(obj.key)
	}

	deleteAll() {
    	this.all(elements => {
        	for (const e of elements) {
        		this.delete(e)
        	}
    	})
	}

	all(callback) {
		this.db.all(callback)
	}

	forEach(callback) {
    	this.all(items => {
        	for (const item of items) {
				callback(item)
			}
    	})
	}
}
