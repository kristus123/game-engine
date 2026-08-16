export class LayoutTest {

	constructor() {
		const html = Html.layoutTest()
		Dom.add(html)

		for (const c of Iterate(80, () => ({
			title: Random.choice(["wow", "yo", "omg"]),
			p: Random.integerBetween(-20, 20),
		}))) {
			const h = Html.card()
			h.style.top = To.string(c.p) + "%"
			html.list.add(h)
		}
	}

	update() {

	}

}
