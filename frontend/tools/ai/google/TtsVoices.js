const _normalize = lang => {
	return lang.toLowerCase().replaceAll("_", "-")
}

let voice = null
let voices = []

const load = () => {
	// console.log("loading voices")

	voices = speechSynthesis.getVoices()

	// console.log("available voices:")
	for (const v of voices) {
		// console.log(v.name, "-", v.lang)
	}

	voice = null
		?? voices.find(v => _normalize(v.lang).includes("en-us"))
		?? voices.find(v => _normalize(v.lang).includes("en"))
		?? null
		// ?? voices.find(v => _normalize(v.lang).includes("zh-cn"))

	// console.log("voice selected:", voice)
	// console.log("voice:", voice)
	// console.log("name:", voice?.name)
	// console.log("lang:", voice?.lang)
	// console.log("localService:", voice?.localService)
}

speechSynthesis.onvoiceschanged = load
load()


export class TtsVoices {
	static get all() {
		return voices
	}

	static get active() {
		return Assert.value(voice)
	}
}
