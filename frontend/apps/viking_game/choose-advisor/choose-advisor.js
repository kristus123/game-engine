const advisors = [
	{ name: "Eira", image: "wise" },
	{ name: "Liv", image: "girl" },
	{ name: "Runa", image: "angry" },
	{ name: "Mikkel", image: "hippy" },
	{ name: "Jarle", image: "painting" },
]

export default {
	fields: () => {
		const chosen = Promise.withResolvers()
		return {
			chosen: chosen.promise,
			resolveChosen: chosen.resolve,
			rejectChosen: chosen.reject,
		}
	},

	onFirstDomAdd: (html) => {
		html.cancel.onClick(() => {
			html.remove()
			html.fields.rejectChosen(new Error("No advisor was selected"))
		})

		for const advisor of advisors {
			const button = html.advisorTemplate.cloneTemplate({
				slots: {
					img: Png[advisor.image],
					name: advisor.name,
				},
			})

			button.onClick(() => {
				html.remove()
				html.fields.resolveChosen(advisor)
			})

			html.advisors.add(button)
		}
	},

	onDomAdd: (html) => {
		html.modal.show()
	},
}
