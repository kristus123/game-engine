export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => ({
	methods: {
		openFriendlyClan: () => html.modal.show(),
		openClanDetails: () => html.secondaryModal.show(),
	},
})
