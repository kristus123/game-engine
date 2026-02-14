export async function LoadJson(url) {
	try {
		const r = await fetch(url)

		if (r.ok) {
			return await r.json()
		}
		else {
			throw new Error(`HTTP error! status: ${r.status}`)
		}
	}
	catch (e) {
		throw new Error('Error loading JSON:', e)
	}
}

