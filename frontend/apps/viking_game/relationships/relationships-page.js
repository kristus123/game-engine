export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default {
	onPageOpen: async (html) => {
		await Sim.click(html.frostholm)
	},
	methods: {
	},
}
