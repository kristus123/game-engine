export async function LoadJson(url) {
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return await response.json()
	}
	catch (err) {
		console.error('Error loading JSON:', err)
		return null
	}
}

