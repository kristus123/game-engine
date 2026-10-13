export default async ({ html }) => {
	const pic = Random.choice([
		Png.lavvo,
		Png.gakti,
		Png.r2,
		Gif.reindeer,
		Png.reindeer,
	])

	html.img.src = pic

	const pos = Random.integerBetween(-20, 20)
	html.style.top = To.string(pos) + "%"
}
