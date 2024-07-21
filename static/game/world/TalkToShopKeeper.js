export class TalkToShopKeeper {

	constructor(player) {

		const square = new Square(new Position(-500, 0), 10)

		this.localObjects = new LocalObjects([
			square,
			new Quest([
				() => new class {
					completed() {
						return square.touches(player)
					}
				},

				() => new class {
					constructor() {
						this.localObjects = new LocalObjects([
							new MultiTextTyper(square.position.over(), [
								'there you are bitch',
								'we need you',
							], () => {
								this.completed = () => true

								QuestList.add('find shit')
							}),
						])
					}

					update() {
						this.localObjects.update()
					}

					draw(draw, guiDraw) {
						this.localObjects.draw(draw, guiDraw)
					}

					completed() {
						return false
					}
				},
				() => new class {
					constructor() {
						this.clues = [
							new Square(new Position(-773, -4), 100),
						]

						this.localObjects = new LocalObjects()
					}

					update() {
						for (const c of this.clues) {
							if (player.touches(c)) {
								List.remove(this.clues, c)
								BottomText.show('found a clue')
								this.localObjects.add(new MultiTextTyper(player.position.over(), [
									'strange',
									'why is this here?'
								], 
								() => {
									this.completed = () => true
								}))
							}
						}

						this.localObjects.update()
					}

					draw(draw, guiDraw) {
						for (const c of this.clues) {
							c.draw(draw, guiDraw)
						}

						this.localObjects.draw(draw, guiDraw)
					}
				},
			]),
		])
	}
	
	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
