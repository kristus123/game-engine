export async function Db(dbName) {

	const db = await new Promise((resolve, reject) => {
		const r = indexedDB.open(dbName)

		r.onupgradeneeded = e => {
			const db = r.result

			if (!db.objectStoreNames.contains(dbName)) {
				db.createObjectStore(dbName, {
					keyPath: "_dbKey",
				})
			}
		}

		r.onsuccess = () => resolve(r.result)
		r.onerror = e => reject(e.target.error)
	})

	const t = (type) => {
		return db.transaction(dbName, type)
	}

	return new class {

		async get(o, callback) { // no-null-check
			const id = o?._dbKey ?? o
			Assert.uuid(id)

			return SimpleAwait(t("readonly").objectStore(dbName).get(id), callback)
		}

		async update(o, callback) { // no-null-check
			Assert.object(o)
			Assert.uuid(o?._dbKey)

			return SimpleAwait(t("readwrite").objectStore(dbName).put(o), callback)
		}

		async save(o, callback) { // no-null-check
			Assert.object(o)
			Assert.null(o._dbKey)

			o._dbKey = Random.uuid()
			return this.update(o, callback)
		}

		async delete(o, callback) { // no-null-check
			const id = o?._dbKey ?? o
			Assert.uuid(id)

			return SimpleAwait(t("readwrite").objectStore(dbName).delete(id), callback)
		}

		async all(callback) { // no-null-check
			return SimpleAwait(t("readonly").objectStore(dbName).getAll(), callback)
		}

		async random(callback) { // no-null-check
			const all = await this.all()
			if (all.empty) {
				callback(null)
				return null
			}
			else {
				const r = all.random()
				callback(r)
				return r
			}
		}
	}
}
