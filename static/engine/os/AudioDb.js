export class AudioDb {
	static {
		this.db = new Db('audioDB', 'clips')
	}

	static save(blob) {
		const uuid = Random.uuid()

		this.db.save(uuid, blob)

		return uuid
	}

	static get(uuid, callback) {
		this.db.get(uuid, callback)
	}

	static delete(uuid) {
		this.db.delete(uuid)
	}

	static all(callback) {
		this.db.all(callback)
	}

}

