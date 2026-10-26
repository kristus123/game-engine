export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

function show(html, title, message) {
	const modal = Assert.value(html.modal)
	modal.modalContent.innerHTML = `<div class="viking-modal-content"><h2>${title}</h2><p>${message}</p></div>`
	modal.show()
}

export default {
	methods: {
		showTimber: (html) => show(html, "Timber", "Strong pine from the western ridge. Spend it carefully on shelters, tools, and the next great hall."),
		showRations: (html) => show(html, "Rations", "Dried fish, berries, and grain enough to keep the village moving through the next journey."),
		showTradeGoods: (html) => show(html, "Trade goods", "Small treasures gathered from distant roads. The right neighbor may value them more than you do."),
		showTools: (html) => show(html, "Tools", "A hatchet, a fishing hook, and a well-used skinning knife. Every one of them has a story."),
	},
}
