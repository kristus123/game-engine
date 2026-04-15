export async function LoadAllAudio(AUDIO_FILES) {
	return Promise.all(AUDIO_FILES.map(async path => {
		const audio = await LoadAudio(path)
		const key = path.split("/").pop().replace(".mp3", "")
		G.Sound[key] = audio
	}))
}

