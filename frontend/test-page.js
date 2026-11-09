export default {
	page: { persistOnClose: true },
	onFirstDomAdd: ({ html }) => {
		for (const button of html.querySelectorAll("[data-track]")) {
			button.disabled = !Ableton.voices[button.dataset.track]
		}
		const status = Ableton.missingTracks.length
			? `Track stems not exported: ${Ableton.missingTracks.join(", ")}. Export each track separately.`
			: "All exported track stems are loaded."
		html.querySelector("#exportStatus").textContent = status
	},
	methods: {
		playNordOne: () => Mix.voices.play(Ableton.voices.nordSami.one),
		playNordTwo: () => Mix.voices.play(Ableton.voices.nordSami.two),
		playNordThree: () => Mix.voices.play(Ableton.voices.nordSami.three),
		playSorOne: () => Mix.voices.play(Ableton.voices.sorSami.one),
		playSorTwo: () => Mix.voices.play(Ableton.voices.sorSami.two),
		playSorThree: () => Mix.voices.play(Ableton.voices.sorSami.three),
		playLuleOne: () => Mix.voices.play(Ableton.voices.luleSami.one),
		playLuleTwo: () => Mix.voices.play(Ableton.voices.luleSami.two),
		playLuleThree: () => Mix.voices.play(Ableton.voices.luleSami.three),
		stopAll: () => Mix.voices.stop(),
	},
}
