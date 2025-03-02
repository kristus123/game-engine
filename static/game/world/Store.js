export class Store {
	constructor() {
		this.foodFactories = new LocalObjects()

		Html.addToScreen(Html.div('upper-center-ui', [
			Html.text('500'),
			Html.div('x', [
				Html.button('open store', b => {
					const modal = Html.modal([
						Html.button('Food factory $500', () => {
							modal.close()

							this.foodFactories.add(new PlaceItems([
								new FoodFactory(Mouse.position.copy(), this.monster),
							], i => {
								this.foodFactories.add(i)
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
		this.foodFactories.update()
	}

	draw(draw, guiDraw) {
		this.foodFactories.draw(draw, guiDraw)
	}
	
}
