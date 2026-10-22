export default ({ html }) => {

	G.onYear(year => {
		html.year.content = year
	})

	G.onWood(wood => {
		html.wood.content = wood
	})

	G.onNewActionTaken(actionsTaken => {
		html.actionsTaken.content = actionsTaken
	})

	return {
		methods: {
			incrementDay: () => {
			},
		},
		onPageOpen: () => {
		},
		onPageClose: () => {
		},
	}
}
