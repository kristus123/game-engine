export async function LoadAudio(url) {
	try {
		const r = await fetch(url)
		const arrayBuffer = await r.arrayBuffer()
		return await AudioContext.decodeAudioData(arrayBuffer)
	}
	catch (err) {
		console.error('Error loading audio:', err)
		return null
	}
}



