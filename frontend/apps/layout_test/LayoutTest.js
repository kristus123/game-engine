export class LayoutTest {

	constructor() {
		const html = Html.layoutTest()
		Dom.add(html)
		for (const c of Iterate(20, () => ({
			title: Random.choice(["wow", "yo", "omg"]),
			p: Random.integerBetween(-30, 30),
		}))) {
			html.list.add(`
				<div max-size class="bgWhite" style="top: ${c.p}%; width:700px; height:40%;">
					<h1 float-top-mid>${c.title}</h1>
					<h1 float-bot-right>swag</h1>
					<h1 float-bot-left>yolo</h1>
					</div>
				</div>
			`.toHtml())
		}
	}

	update() {

	}

}
