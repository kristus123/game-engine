export class SimpleMonster extends DynamicGameObject {
	constructor() {
		super(new Position(0, 0, 300, 200), 10, 10)

		this.hunger = 100

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),
			// new RotatingPicture(this, '/static/assets/blob_57x32.png'),
			Init(this, {
				splash: new SplashParticles(),
			})
		])

		Mouse.addOnClick('click monster', () => {
			if (Mouse.hovering(this)) {
				this.splash.random(Mouse.position)
			}
		})

	}

	update() {
		this.hunger -= 0.1
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		if (this.hunger > 70) {
			draw.text(this.position.over(), 'happy', 'green')
		}
		else if (this.hunger > 40) {
			draw.text(this.position.over(), 'grumpy', 'orange')
		}
		else {
			draw.text(this.position.over(), 'ANGRY', 'red')
		}



		draw.hpBar(this.position.over(), this.hunger, 100)
		this.localObjects.draw(draw, guiDraw)
	}
}
