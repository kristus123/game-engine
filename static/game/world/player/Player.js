export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

		this.position.width = 110
		this.position.height = 150

		this.localObjects = new LocalObjects([
			// G.sprites.viking(new Position(0, 0, 100, 100)),
			// G.sprites.player(this.position),
			Init(this, {
				// playerSprites: new PlayerSprites(this),

				pickUpChicken: new PickUp(Registry.Chicken, () => {
					BottomText.show('Bring the chicken to the KillingMachine', 2_000)
				}),

				pickUpBox: new PickUp(Registry.ChickenBox, () => {
					BottomText.show('Bring the box to the supermarket', 2_000)
				}),

				pickUpDeadChicken: new PickUp(Registry.DeadChicken, () => {
					BottomText.show('dead chicken', 2_000)
				}),

				chickenFood: new Throw(() => new ChickenFood(this.position.copy())),
			}),
		])

		// KeyDown(' ', () => { // space
		// 	this.playerSprites.jump()
		// })
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {


		this.localObjects.draw(draw, guiDraw)
	}
}
