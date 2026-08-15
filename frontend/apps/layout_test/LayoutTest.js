export class LayoutTest {

	constructor() {
		const html = Html.layoutTest()
		Dom.add(html)

		for (const c of Iterate(80, () => ({
			title: Random.choice(["wow", "yo", "omg"]),
			p: Random.integerBetween(-30, 30),
		}))) {
			html.list.add(`
				<div class="bgWhite" style="top: ${c.p}%; width:100px; height:40%;">
					<other-thing>
						<slot name="title">
							hello
						</slot>
					</other-thing>
				</div>
			`)
		}
	}

	update() {

	}

}
