export default {
	onFirstDomAdd: (html) => {
		G.onYear(year => {
			html.year.content = year
		})
		G.onWood(wood => {
			html.wood.content = wood
		})
		G.onNewActionTaken(actionsTaken => {
			html.actionsTaken.content = actionsTaken
		})
	},
	methods: {
		showJarle: (html) => html.jarleModal.show(),
		chooseAdvisor: async () => {
			const chooser = H.create("choose-advisor")
			Dom.add(chooser)
			console.log("Chosen advisor:", await chooser.chosen)
		},
		incrementDay: () => {
		},
	},
	onPageOpen: async () => {
	},
	onPageClose: () => {
	},
}
