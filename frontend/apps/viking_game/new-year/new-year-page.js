export const page = {
	persistOnClose: true,
	// layout: "pretty-layout",
}

export default ({ html }) => {
	return {
		onPageOpen: () => {
			setTimeout(() => {
				Page.open("village-page")
			}, 1_000)

		},
		onPageClose: () => {
		},
	}
}
