export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
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

	const show = key => {
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
				G.year += 1
				if (choice.next == "end") {
					await Page.open("aoe-page")
					show("start")
				}
				else {
					show(choice.next)
				}
			})

			html.choices.add(button)
		}
	}

	show("start")

	return {
		onPageOpen: () => html.play("pageEnterRight"),
		onPageClose: () => html.play("pageExitRight"),
		onDomAdd: () => {
			console.log("these will also trigger as usual")
		},
		onDomRemove: () => {
			console.log("these will also trigger as usual")
		},
		onHover: {
			advicePopover: ({ origin, popover, hovering }) => {
				if hovering {
					const advisor = Advisors.find(a => a.name == origin.data.advisor)
					popover.h1.content = advisor.name
					popover.p.content = Random.choice(advisor.advice)
				}
			},
		},
	}
}
