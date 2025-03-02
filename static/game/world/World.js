export class World {
	constructor() {

		Controller.control(this.player)
		const monster = new SimpleMonster()
		this.monster = monster
		Cam.followInstantly(monster.position.center)

		const poop = new LocalObjects()
		this.poop = poop

		this.foodFactory = new FoodFactory(new Position(0,0), monster)
		this.localObjects = new LocalObjects([
			poop,
			monster,

			Init(this, {
				splash: new SplashParticles(),
				brownSplash: new SplashParticles(),
			})
		])

		Html.addToScreen(Html.div('upper-center-ui', [
			Html.div('x', [
				Html.button('open store', b => {
					const modal = Html.modal([
						Html.button('Food factory $500', () => {
							modal.close()

							this.localObjects.add(new PlaceItems([
								new FoodFactory(Mouse.position.copy(), monster),
							], i => {
								this.localObjects.add(Init(this, {
									foodFactory: i,
								}))
							}))
						}),
					])
					Html.addToScreen(modal)

					modal.showModal()
				}),
			]),
		]))


		Html.addToScreen(Html.div('lower-center-ui', [
			Html.div('shoulder-to-shoulder', [
				Html.button('Feed', b => {
					monster.hunger += 10
					Html.fadeaway('wise choice')
					Html.disableFor(1000, b)
				}),
				Html.button('Poop', () => {
					const p = new Square(monster.position.center.copy(), 10)
					p.x += 150
					p.y += 150
					p.color = 'brown'
					poop.add(p)
					this.brownSplash.random(p, 'brown')
				}),
			]),
			HtmlProgressBar.create(),
		]))
	}

	update() {
		this.localObjects.update()

		if (this.foodFactory.foods.empty()) {
			this.monster.velocity.reset()
		}
		else {
			ForcePush(this.monster).towards(this.foodFactory.foods.first(), 20)
		}

		for (const f of this.foodFactory.foods.objects) {
			if (this.monster.touches(f)) {
				this.splash.random(f)
				this.foodFactory.foods.remove(f)
				this.monster.hunger += 10
				Html.fadeaway('delicious!', Cam.p(this.monster))
				HtmlProgressBar.change(+1)
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
