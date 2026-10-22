export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => ({
	methods: {
		openFriendlyClan: () => html.modal.show(),
		raid: () => {
			G.chopWood()
		},
	},
})
