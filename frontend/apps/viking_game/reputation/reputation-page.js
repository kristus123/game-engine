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
			showGenerosity: () => show("Generosity", "Neighbors remember the supplies Vikingheim shares when winter is hardest."),
			showReliability: () => show("Reliability", "Promises kept during road-building have earned trust from the surrounding clans."),
			showHospitality: () => show("Hospitality", "Travelers speak warmly of the fire, food, and stories waiting in your hall."),
		},
	}
}
