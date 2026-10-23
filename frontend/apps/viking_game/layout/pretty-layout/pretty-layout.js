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
			showJarle: () => html.jarleModal.show(),
			incrementDay: () => {
			},
		},
		onPageOpen: async () => {
		},
		onPageClose: () => {
		},
	}
}
