export class Penguin extends DynamicGameObject {
	constructor(position, player, house) {
		super(position, 10, 10)

		this.position.width = 120
		this.position.height = 180

		const penguin = this
		
		const e = new Key('e')

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/penguin.png'),
			new Quest([
				() => new class {
					update() {
						if (player.within(100, penguin)) {
							BottomText.show('what is this')
							this.completed = () => true
						}
					}
				},
				() => new class {
					constructor() {
						this.movableObjects = new MovableObjects(player, [penguin])
						BottomText.show('Find out what this strange penguin is')
						this.task = QuestList.add('Deliver unknown piece to science lab')
					}

					update() {
						this.movableObjects.update()
					}

					draw(draw, guiDraw) {
						this.movableObjects.draw(draw, guiDraw)
					}

					completed() {
						if (penguin.within(300, house) || penguin.touches(house)) {
							this.task.completed()
							penguin.velocity.reset()
							return true
						}
						else {
							return false
						}
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
