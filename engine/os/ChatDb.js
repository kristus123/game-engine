export class ChatDb {
	static {
		this.hisotry = {}
	}

	static save(uuid, from, to, blob) {
		AssertNotNull(uuid)
		AssertNotNull(blob)

		this.hisotry[uuid] = {
			originClientId: from,
			targetClientId: to,
			audio: blob
		}

		return uuid
	}

	static get(uuid, callback) {
		callback(this.hisotry[uuid])
	}

	static delete(uuid) {
		delete this.hisotry[uuid]
	}

	static all(callback) {
		callback(this.hisotry)
	}
}