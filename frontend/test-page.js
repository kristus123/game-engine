export default {
	page: { persistOnClose: true },
	onFirstDomAdd: ({ html }) => {
		for const button of html.querySelectorAll("[data-track]") {
			button.disabled = !Ableton.projects.voices?.[button.dataset.track]
		}
	},
	methods: {
		playNordOne: () => Mix.voices.play(Ableton.projects.voices.nordSami["1"]),
		playNordTwo: () => Mix.voices.play(Ableton.projects.voices.nordSami["2"]),
		playNordThree: () => Mix.voices.play(Ableton.projects.voices.nordSami["3"]),
		playSorOne: () => Mix.voices.play(Ableton.projects.voices.sorSami["1"]),
		playSorTwo: () => Mix.voices.play(Ableton.projects.voices.sorSami["2"]),
		playSorThree: () => Mix.voices.play(Ableton.projects.voices.sorSami["3"]),
		playLuleOne: () => Mix.voices.play(Ableton.projects.voices.luleSami["1"]),
		playLuleTwo: () => Mix.voices.play(Ableton.projects.voices.luleSami["2"]),
		playLuleThree: () => Mix.voices.play(Ableton.projects.voices.luleSami["3"]),
		stopAll: () => Mix.voices.stop(),
	},
}
