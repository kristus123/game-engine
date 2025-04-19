export class House extends StaticGameObject {
	constructor(player) {
		super(new Position(-1000, -300, 1000, 500))

		const house = this

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/house.png'),
			new Quest([
				() => new class {
					constructor() {
						this.task = QuestList.add('Locate research facility')
						this.compass = new Compass([house])
					}

					update() {
					}

					draw(draw, guiDraw) {
						this.compass.draw(draw, guiDraw)
					}

					completed() {
						if (house.within(2000, player)) {
							this.task.completed()
							return true
						}
						else {
							return false
						}
					}
				},
				() => new class {
					constructor() {
						this.task = QuestList.add('Look for survivors')

						this.completed = () => false
						setTimeout(() => {
							BottomText.show('No survivors in sight')
							setTimeout(() => {
								BottomText.remove()
							}, 1000)

							this.task.completed()
							this.completed = () => true
						}, 1000)
					}
				}
			])
		])
	}

	update() {
		this.localObjects.update()

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

	}
}
