export async function LoadAllWebComponents(all) {
	return Promise.all(all.map(async w => {
		const response = await fetch(w.path)
		const html = await response.text()

		return WebComponent(w.name, html)
	}))
	
}
