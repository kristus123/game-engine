export default {
	page: {
		persistOnClose: true,
		layout: "pretty-layout",
	},
	onDomAdd: async ({ html }) => {
		await Sim.click(html.frostholm)
	},
	methods: {
	},
}
