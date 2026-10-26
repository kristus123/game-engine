export const page = {
	persistOnClose: true,
}

async function loadNewCard(html) {
	html.fields.setState("loading")
	html.fields.card = await html.fields.cardDb.cardToPractice()

	if html.fields.card {
		Sound.playBlob(html.fields.card.practiceSide().sound)
		return html.fields.setState("hasCard")
	}
	else {
		return html.fields.setState("noMoreCards")
	}
}

const component = {
	fields: () => ({
		card: null,
		cardDb: null,
		setState: null,
	}),
	state: async (html, setState) => {
		html.fields.setState = setState
		html.fields.cardDb = await CardDb()
		return await loadNewCard(html)
	},
	onFirstDomAdd: (html) => {
		Screen.keepAwake()

		const stopWatch = StopWatch().start()
		setInterval(() => {
			html.time.content = stopWatch.mmss
		}, 950)

		GamepadController.left = () => {
			component.methods.easy(html)
		}
		GamepadController.right = () => {
			component.methods.hard(html)
		}
		GamepadController.triangle = () => {
			component.methods.playFront(html)
		}
		GamepadController.cross = () => {
			component.methods.playBack(html)
		}
		FrameLoop(() => {
			GamepadController.update()
		})
	},
	methods: {
		playFront: async (html) => {
			Sound.playBlob(html.fields.card.practiceSide().sound)
		},
		playBack: async (html) => {
			Sound.playBlob(html.fields.card.otherSide().sound)
		},
		easy: async (html) => {
			await html.fields.card.markEasy()
			await html.fields.cardDb.update(html.fields.card)
			await loadNewCard(html)
		},
		hard: async (html) => {
			await html.fields.card.markHard()
			await html.fields.cardDb.update(html.fields.card)
			await loadNewCard(html)
		},
		practiceMore: async (html) => {
			await html.fields.cardDb.resetAllDueDates()
			await loadNewCard(html)
		},
		deleteCard: async (html) => {
			await html.fields.cardDb.delete(html.fields.card)
			await loadNewCard(html)
		},
	},
}

export default component
