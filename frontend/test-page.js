export default {
	page: { persistOnClose: true },
	onFirstDomAdd: ({ html }) => {
		for (const button of html.querySelectorAll("[data-track]")) {
			button.disabled = !Ableton.voices[button.dataset.track]
		}
		html.querySelector("#mixButton").disabled = !Ableton.mix
		const status = Ableton.missingTracks.length
			? `Track stems not exported: ${Ableton.missingTracks.join(", ")}. Play the full mix or export each track separately.`
			: "All exported track stems are loaded."
		html.querySelector("#exportStatus").textContent = status
	},
	methods: {
		playMix: () => Ableton.mix.play(),
		playNordOne: () => Mix.voices.play(Ableton.voices.nordSami.one),
		playNordTwo: () => Ableton.voices.nordSami.two.play(),
		playNordThree: () => Ableton.voices.nordSami.three.play(),
		playSorOne: () => Ableton.voices.sorSami.one.play(),
		playSorTwo: () => Ableton.voices.sorSami.two.play(),
		playSorThree: () => Ableton.voices.sorSami.three.play(),
		playLuleOne: () => Ableton.voices.luleSami.one.play(),
		playLuleTwo: () => Ableton.voices.luleSami.two.play(),
		playLuleThree: () => Ableton.voices.luleSami.three.play(),
		stopAll: () => {
			Ableton.mix?.stop()
			Ableton.voices.nordSami?.stop()
			Ableton.voices.sorSami?.stop()
			Ableton.voices.luleSami?.stop()
		},
	},
}
