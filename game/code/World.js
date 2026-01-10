// ClientId(



export class World {
	constructor() {

		GridUi.top.add(Html.p(Viking.text))
		for (const choice of Viking.choices) {
  			GridUi.bottom.add(Html.button(choice.text, () => {
				GridUi.top.clear()
				GridUi.bottom.clear()

				GridUi.top.add(Html.p(Viking.text))


			}))
		}




	}


	update() {

	}

	draw(draw) {}
}
