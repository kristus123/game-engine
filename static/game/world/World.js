export class World {
	constructor() {

		Controller.control(this.player)
		const monster = new SimpleMonster()
		this.monster = monster
		Cam.followInstantly(monster.position.center)

		const food = new LocalObjects()
		this.food = food

		const poop = new LocalObjects()
		this.poop = poop

		this.localObjects = new LocalObjects([
			poop,
			monster,
			food,

			Init(this, {
				splash: new SplashParticles(),
				brownSplash: new SplashParticles(),
			})
		])

		const modal = Html.modal([
			Html.button('Food factory $500', () => {
				modal.close()
			}),
		])
		Html.addToScreen(modal)

		modal.showModal()

		Html.addToScreen(Html.div('lower-center-ui', [
			Html.div('shoulder-to-shoulder', [
				Html.button('Feed', b => {
					monster.hunger += 10
					Html.fadeaway('wise choice')
					Html.disableFor(1000, b)
				}),
				Html.button('place candy', b => {
					const p = Random.direction(monster.position, 400)
					const f = new Square(p, 10)
					food.add(f)
					Html.fadeaway('wise choice')
					// Html.disableFor(1000, b)
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

		if (this.food.empty()) {
			this.monster.velocity.reset()
		}
		else {
			ForcePush(this.monster).towards(this.food.first(), 20)

		}
		
		for (const f of this.food.objects) {
			if (this.monster.touches(f)) {
				this.splash.random(f)
				this.food.remove(f)
				this.monster.hunger += 10
				Html.fadeaway('delicious!', Cam.p(this.monster))
				HtmlProgressBar.change(1)
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
