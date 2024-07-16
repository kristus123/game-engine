export class Thing extends StaticGameObject {
	constructor(position, player, house) {
		super(position)

		this.position.width = 100
		this.position.height = 100

		const thing = this
		
		const e = new Key('e')

		this.localObjects = new LocalObjects([
			new Quest([
				() => new class {
					update() {
						if (player.within(100, thing)) {
							BottomText.show('what is this')
							this.completed = () => true
						}
					}
				},
				() => new class {
					draw(draw, guiDraw) {
						draw.text(thing.position.over(200), 'Press E to pick')
						if (e.down) {
							this.completed = () => true
						}
					}
				},
				() => new class {
					constructor() {
						BottomText.show('Find out what this strange thing is')
						this.task = QuestList.add('Deliver unknown piece to science lab')
					}

					completed() {
						if (house.within(300, player) || house.touches(player)) {
							this.task.completed()
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
		super.draw(draw, guiDraw)
	}

}
