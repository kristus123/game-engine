export class LayoutTest {

	constructor() {
		const html = Html.layoutTest()
		Dom.add(html)
		for (const c of Iterate(80, () => ({
			title: Random.choice(["wow", "yo", "omg"]),
			p: Random.integerBetween(-30, 30),
		}))) {
			html.list.add(`
				<div center-content class="bgWhite" style="top: ${c.p}%; width:100px; height:40%;">
					<h1>hei</h1>
					<button max-width>
						Play
					</button>
				</div>
			`.toHtml())
		}
	}

	update() {

	}

}
