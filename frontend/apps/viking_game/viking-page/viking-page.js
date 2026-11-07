function show(html, key) {
	const { text, choices } = Assert.value(Story[key])

	html.story.content = text
	html.choices.removeChildren()

	for const choice of choices {
		const button = html.choiceButtonTemplate.cloneTemplate({
			slots: {
				text: choice.text
			},
		})

		button.onClick(async () => {
			if choice.next == "end" {
				G.chopWood()
				G.newActionTaken()
				await Page.open("village-page")
				show(html, "start")
			}
			else {
				show(html, choice.next)
			}
		})

		html.choices.add(button)
	}
}

export default {
	page: {
		persistOnClose: true,
		layout: "pretty-layout",
	},
	onFirstDomAdd: ({ html }) => {
		for const advisor of Advisors {
			html.advisors.add(html.advisorTemplate.cloneTemplate({
				slots: {
					img: Png[advisor.image],
				},
				data: {
					advisor: advisor.name,
				},
			}))
		}
		show(html, "start")
	},
	onDomAdd: ({ html }) => html.play("pageEnterRight"),
	onDomRemove: ({ html }) => html.play("pageExitRight"),
	onHoverShow: {
		advicePopover: (html, { origin, popover }) => {
			const advisor = Advisors.find(a => a.name == origin.data.advisor)
			popover.h1.content = advisor.name
			popover.p.content = Random.choice(advisor.advice)
		},
	},
	onHoverHide: {
		otherRandomThing: () => {
			console.log("not yet implemented")
		},
	},
}
