export default {
	onFirstDomAdd: ({ html }) => {
		const pic = Random.choice([
			Png.lavvo,
			Png.gakti,
			Png.r2,
			Gif.reindeer,
			Png.reindeer,
		])

		html.img.src = pic
		html.gameTitle.textContent = html.data.name.replaceAll("_", " ")

		if (html.data.page != "") {
			html.button.onClick(() => Page.open(html.data.page))
		}
		else {
			html.button.disabled = true
		}

		const pos = Random.integerBetween(-30, 10)
		html.style.top = To.string(pos) + "%"
	},
}
