export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	const show = (title, message) => {
		const modal = Assert.value(html.closest("pretty-layout").modal)
		modal.modalContent.innerHTML = `<div class="viking-modal-content"><h2>${title}</h2><p>${message}</p></div>`
		modal.show()
	}

	return {
		methods: {
			showFrostholm: () => show("Frostholm", "The farmers nearby keep full granaries and welcome fair trade. Your relationship is friendly."),
			showRiverClan: () => show("The River Clan", "Skilled fishers live along the river. They are watching to see whether Vikingheim keeps its promises."),
			showBlackPine: () => show("Black Pine Watch", "The hunters keep their distance, but a reliable ally could change their minds."),
		},
	}
}
