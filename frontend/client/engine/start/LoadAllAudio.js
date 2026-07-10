export async function LoadAllAudio(AUDIO_FILES) {
	return Promise.all(AUDIO_FILES.map(async path => {

		const name = path.split("/").pop().replace(".mp3", "")

		try {
			const r = await fetch(path)

			const b = await r.arrayBuffer()
			const buffer = await SoundContext.decodeAudioData(b)
			Mp3[name] = buffer
		}
		catch (e) {
			throw new Error("Error loading audio: " + e)
		}
	}))
}
