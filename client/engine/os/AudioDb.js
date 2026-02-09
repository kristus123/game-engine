export class AudioDb {
	static {
		this.db = Db('audioDB', 'clips')
	}

	static save(uuid, blob) {
		Assert.notNull(uuid)
		Assert.notNull(blob)

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
		this.db.all(entries => callback(entries.map(e => e.value)))
	}

}

