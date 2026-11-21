let quiz = null

export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},

	onFirstDomAdd: ({ html }) => {
		quiz = {
			text: "Can you find the reindeer?",
			choices: {
				reindeer: Ableton.projects.voices.norwegian.reindeer,
				fish: Ableton.projects.voices.norwegian.fish,
				mouse: Ableton.projects.voices.norwegian.mouse,
			},
			answer: "reindeer",
		}

		html.answers.replaceChildren()

		for const [choice, audio] of quiz.choices.all {
			html.answers.append(H.button(choice, () => {
				if choice == quiz.answer {
					// Tts("success")
					console.log(audio)
					Mix.master.play(audio)
				}
				else {
					Mix.master.play(audio)
					// Tts("Try again!")
				}
			}))
		}
	},
	methods: {
		playPrompt: html => {
			Tts(quiz.text)
		},
	},
}
