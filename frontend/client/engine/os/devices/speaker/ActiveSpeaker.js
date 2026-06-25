export class ActiveSpeaker {

	static get active() {
		return localStorage.getItem("selectedSpeaker") ?? null
	}

	static set active(speaker) {
		if (speaker == null || speaker == "") {
			localStorage.removeItem("selectedSpeaker")
		}
		else {
			localStorage.setItem("selectedSpeaker", speaker)
		}
	}

}