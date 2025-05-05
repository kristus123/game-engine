export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

		this.position.width = 110
		this.position.height = 150

		this.localObjects = new LocalObjects([
			Init(this, {
				playerSprites: new PlayerSprites(this),
				pickUp: new PickUp(() => [...Registry.Chicken, ...Registry.ChickenBox]),
				chickenFood: new Throw(() => new ChickenFood(this.position.copy())),
			}),
			OnTrue(() => this.pickUp.holding, h => {
				if (h instanceof Chicken) {
					this.chicken = h
					BottomText.show('Bring the chicken to the KillingMachine', 2_000)
				}
				if (h instanceof ChickenBox) {
					BottomText.show('Bring the box to the supermarket', 2_000)
				}
			}),
		])

		KeyDown(' ', () => { // space
			this.playerSprites.jump()
		})
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
