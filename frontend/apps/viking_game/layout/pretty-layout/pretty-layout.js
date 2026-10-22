export default ({ html }) => {
	const border = html.firstElementChild
	border.style.transition = "border-color 300ms ease"

	G.onYear(year => {
		html.days.content = year
	})

	G.onWood(wood => {
		html.wood.content = wood
	})

	Game.onNewActionTaken(actionsTaken => {
		html.actionsTaken.content = actionsTaken
	})

	return {
		methods: {
			incrementDay: () => {
			},
		},
		onPageOpen: () => {
			border.style.borderColor = Random.choice(["#ff69b4", "#ffd166", "#06d6a0", "#4cc9f0"])
		},
		onPageClose: () => {
			border.style.borderColor = "transparent"
		},
	}
}
