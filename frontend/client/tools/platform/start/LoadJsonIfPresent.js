export async function LoadJsonIfPresent(url) {
	try {
		const result = await fetch(url)
		if (result.ok) {
			const text = await result.text()
			if (text == "null") {
				return false
			}
			else {
				return JSON.parse(text)
			}
		}
		else {
			return false
		}
	}
	catch (e) {
		throw e
	}
}

