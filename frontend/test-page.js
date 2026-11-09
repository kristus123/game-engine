export default {
	page: { persistOnClose: true },
	onFirstDomAdd: ({ html }) => {
		for (const button of html.querySelectorAll("[data-track]")) {
			button.disabled = !Ableton.projects.voices?.[button.dataset.track]
		}
	},
	methods: {
		playNordOne: () => Mix.voices.play(Ableton.projects.voices.nordSami.one),
		playNordTwo: () => Mix.voices.play(Ableton.projects.voices.nordSami.two),
		playNordThree: () => Mix.voices.play(Ableton.projects.voices.nordSami.three),
		playSorOne: () => Mix.voices.play(Ableton.projects.voices.sorSami.one),
		playSorTwo: () => Mix.voices.play(Ableton.projects.voices.sorSami.two),
		playSorThree: () => Mix.voices.play(Ableton.projects.voices.sorSami.three),
		playLuleOne: () => Mix.voices.play(Ableton.projects.voices.luleSami.one),
		playLuleTwo: () => Mix.voices.play(Ableton.projects.voices.luleSami.two),
		playLuleThree: () => Mix.voices.play(Ableton.projects.voices.luleSami.three),
		stopAll: () => Mix.voices.stop(),
	},
}
