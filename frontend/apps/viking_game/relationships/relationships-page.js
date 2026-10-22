export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {

	return {
		onPageOpen: async () => {
			await Sim.click(html.frostholm)
		},
		methods: {
		},
	}
}
