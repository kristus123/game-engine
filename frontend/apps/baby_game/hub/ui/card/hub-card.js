export default {
	onFirstDomAdd: (html) => {
		const pic = Random.choice([
			Png.lavvo,
			Png.gakti,
			Png.r2,
			Gif.reindeer,
			Png.reindeer,
		])

		html.img.src = pic

		html.button.onClick(() => {
			Page.open("find-pair-page")
		})

		const pos = Random.integerBetween(-20, 20)
		html.style.top = To.string(pos) + "%"
	},
}
