export class AudioDb {
	static {
		this.db = new Db('audioDB', 'clips')
	}

	static save(key, blob) {
		this.db.save(key, blob)
	}

	static get(key, callback) {
		this.db.get(key, callback)
	}

	static delete(key) {
		this.db.delete(key)
	}

	static all(callback) {
		this.db.all(callback)
	}

}

