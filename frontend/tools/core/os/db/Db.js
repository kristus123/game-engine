export async function Db(dbName, { prototype = {} } = {}) {

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

	const t = type => {
		return db.transaction(dbName, type)
	}

	const applyPrototype = elements => {
		for (const e of Always.list(elements)) {
			Object.setPrototypeOf(e, prototype)
		}

		return elements
	}

	return new class {

		async get(o) {
			const id = o?._dbKey ?? o
			Assert.uuid(id)

			return applyPrototype(await SimpleAwait(t("readonly").objectStore(dbName).get(id)))
		}

		async update(o) {
			Assert.object(o)
			Assert.uuid(o?._dbKey)

			await SimpleAwait(t("readwrite").objectStore(dbName).put(o))

			return o
		}

		async save(o) {
			Assert.object(o)
			Assert.null(o._dbKey)

			o._dbKey = Random.uuid()

			return await this.update(o)
		}

		async delete(o) {
			const id = o?._dbKey ?? o
			Assert.uuid(id)

			return await SimpleAwait(t("readwrite").objectStore(dbName).delete(id))
		}

		async all() {
			return applyPrototype(await SimpleAwait(t("readonly").objectStore(dbName).getAll()))
		}

		async random() {
			const all = await this.all()

			if (all.empty) {
				return null
			}
			else {
				const r = all.random()
				return r
			}
		}
	}
}
