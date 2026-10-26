export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default {
	methods: {
		openFriendlyClan: (html) => html.modal.show(),
		raid: () => {
			G.chopWood()
		},
	},
}
