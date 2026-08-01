export class ActiveMic {

	static get selected() {
		return localStorage.getItem("selectedMic") ?? null
	}

	static set selected(m) {
		localStorage.setItem("selectedMic", m)
	}
}
