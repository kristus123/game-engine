export class Store {
	constructor() {
		this.localObjects = new LocalObjects()

		Html.addToScreen(Html.div('upper-center-ui', [
			Html.div('x', [
				Html.button('open store', b => {
					const modal = Html.modal([
						Html.button('Food factory $500', () => {
							modal.close()

							this.localObjects.add(new PlaceItems([
								new FoodFactory(Mouse.position.copy(), this.monster),
							], i => {
								this.localObjects.add(i)
							}))
						}),
					])
					Html.addToScreen(modal)

					modal.showModal()
				}),
			]),
		]))
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
