export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default {
	onPageOpen: () => {
		setTimeout(() => {
			if Page.activeTag == "new-year-page" {
				Page.open("village-page")
			}
		}, 1_000)
	},
	onPageClose: () => {
	},
}
