export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	const show = (title, message, image) => {
		const modal = Assert.value(html.closest("pretty-layout").modal)
		modal.modalContent.innerHTML = `<div class="viking-modal-content"><img src="${image}" alt="${title}" /><h2>${title}</h2><p>${message}</p></div>`
		modal.show()
	}

	return {
		methods: {
			showJarle: () => show("Jarle", "The head of the household watches the northern road and keeps the hearth ready for every traveler.", Png.painting),
			showLiv: () => show("Liv", "Liv keeps the old stories alive and knows which songs can soften even the longest winter.", Png.girl),
			showEira: () => show("Eira", "Eira notices the details everyone else misses. Her advice is quiet, careful, and usually right.", Png.wise),
			showMikkel: () => show("Mikkel", "Mikkel is always looking beyond the next hill, searching for a path no one else has found.", Png.hippy),
		},
	}
}
