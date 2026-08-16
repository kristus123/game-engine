export class LayoutTest {

	constructor() {
		const html = Html.layoutTest()
		Dom.add(html)

		MouseDragScroll.horizontal(html.area)

		for (const c of Iterate(10, () => ({
			title: Random.choice(["wow", "yo", "omg"]),
			p: Random.integerBetween(-20, 20),
		}))) {
			const h = Html.card()
			const p = Random.choice([
				"lavvo.png",
				"gakti.png",
				"r2.png",
				"reindeer.gif",
				"reindeer.png",
			])
			h.img.src = `/apps/layout_test/pics/${p}`
			h.style.top = To.string(c.p) + "%"
			html.list.add(h)
		}
	}

	update() {

	}

}
