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
		showHearth: (html) => show(html, "The First Hearth", "The first settlers followed the northern lights until one green ribbon settled above the valley. They built their hall where the snow melted first."),
		showMountain: (html) => show(html, "The Watchful Mountain", "The mountain remembers every oath spoken beneath it. At dawn, its peak shines like a blade."),
		showRiver: (html) => show(html, "The River Below", "Before Vikingheim had roads, the river carried messages between the clans. Its bends still mark the oldest paths."),
	},
}
