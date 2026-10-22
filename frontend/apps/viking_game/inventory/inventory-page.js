export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	const show = (title, message) => {
		const modal = Assert.value(html.modal)
		modal.modalContent.innerHTML = `<div class="viking-modal-content"><h2>${title}</h2><p>${message}</p></div>`
		modal.show()
	}

	return {
		methods: {
			showTimber: () => show("Timber", "Strong pine from the western ridge. Spend it carefully on shelters, tools, and the next great hall."),
			showRations: () => show("Rations", "Dried fish, berries, and grain enough to keep the village moving through the next journey."),
			showTradeGoods: () => show("Trade goods", "Small treasures gathered from distant roads. The right neighbor may value them more than you do."),
			showTools: () => show("Tools", "A hatchet, a fishing hook, and a well-used skinning knife. Every one of them has a story."),
		},
	}
}
