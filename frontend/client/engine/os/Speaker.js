export class Speaker {

	static get selected() {
		return localStorage.getItem("selectedSpeaker") ?? null
	}

	static set selected(speaker) {
		if (speaker == null || speaker == "") {
			localStorage.removeItem("selectedSpeaker")
		}
		else {
			localStorage.setItem("selectedSpeaker", speaker)
		}
	}

	static get active() {
		return this.selected
	}

	static set active(speaker) {
		this.selected = speaker
	}

}
