export class Speaker {

	static get active() {
		return localStorage.getItem("selectedSpeaker") ?? null
	}

	static set active(speaker) {
		if (speaker == null) {
			localStorage.removeItem("selectedSpeaker")
		}
		else {
			localStorage.setItem("selectedSpeaker", speaker)
		}
	}
}