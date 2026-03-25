export class Db {
	constructor(dbName) {
    	this.db = new LowDb(dbName)
	}

	save(o) {
		if (o._dbKey) {
        	throw new Error("Cannot save an object which has an existing key") //todo fix
    	}

    	this.db.save(o)
	}

	get(key, callback) {
    	this.db.get(key, (e) => {
			callback(DbObject(e))
    	})
	}

	deleteAll() {
    	this.db.forEach(e => {
			this.db.delete(e)
    	})
	}

	forEach(callback) {
		this.db.forEach(e => {
			console.log(e)
			callback(e)
		})
	}
}
