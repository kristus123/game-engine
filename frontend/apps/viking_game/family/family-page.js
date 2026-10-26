export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

function show(html, title, message, image) {
	const modal = Assert.value(html.modal)
	modal.modalContent.innerHTML = `<div class="viking-modal-content"><img src="${image}" alt="${title}" /><h2>${title}</h2><p>${message}</p></div>`
	modal.show()
}

export default {
	methods: {
		showJarle: (html) => show(html, "Jarle", "The head of the household watches the northern road and keeps the hearth ready for every traveler.", Png.painting),
		showLiv: (html) => show(html, "Liv", "Liv keeps the old stories alive and knows which songs can soften even the longest winter.", Png.girl),
		showEira: (html) => show(html, "Eira", "Eira notices the details everyone else misses. Her advice is quiet, careful, and usually right.", Png.wise),
		showMikkel: (html) => show(html, "Mikkel", "Mikkel is always looking beyond the next hill, searching for a path no one else has found.", Png.hippy),
	},
}
