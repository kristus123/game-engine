export default async ({ html }) => {
	const pic = Random.choice([
		"lavvo.png",
		"gakti.png",
		"r2.png",
		"reindeer.gif",
		"reindeer.png",
	])

	html.img.src = `/apps/layout_test/pics/${pic}`

	const pos = Random.integerBetween(-20, 20)
	html.style.top = To.string(pos) + "%"
}
