export function SimpleAwait(r, callback) { // allow-null
	return new Promise((resolve, reject) => {
		r.onsuccess = () => {
			callback?.(r.result)
			resolve(r.result)
		}

		r.onerror = e => {
			console.error("error in await")
			reject(e.target.error)
		}
	})
}

