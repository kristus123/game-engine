export async function LoadJsonIfPresent(url) {
	try {
		const r = await fetch(url)

		if (r.ok) {
			return await r.json()
		}
		else {
    		return null
		}
	}
	catch (e) {
		throw new Error('Error loading JSON:', e)
	}
}
