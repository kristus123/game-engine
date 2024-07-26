export class TalkToShopKeeper {

	constructor(player) {

		const square = new Square(new Position(-500, 0), 200)
		const staticPicture = new StaticPicture(square.position, '/static/assets/shopkeeper.png')
		square.draw = (draw, guiDraw) => {
			staticPicture.draw(draw, guiDraw)
		}

		const hoe = new DynamicGameObject(new Position(-400, 0, 100, 300), 10, 10)
		const sprite = new Sprite(hoe.position.offset(0, 0, 300, 250), '/static/assets/woman_32x32.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
		])
		hoe.draw = (draw, guiDraw) => {
			sprite.draw(draw, guiDraw)
		}

		this.localObjects = new LocalObjects([
			square,
			hoe,
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
								BottomText.show('found a clue', 200)
								QuestList.clear()
								this.localObjects.add(new MultiTextTyper(player.position.over(), [
									'strange',
									'why is this here?',
									'why does the pimp want me to smuggle his hoes to the city?',
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
				() => new class {
					constructor() {

						this.localObjects = new LocalObjects([
							hoe,
							Init(this, [
								{ enemies: new LocalObjects() },
								{ deliveryZone: new DeliveryZone(new Position(1188, -292, 100, 100), [hoe]) },
							]),
							new Sword(player, this.enemies.objects),
							new PushEnemies(player, this.enemies.objects),
							new MultiTextTyper(hoe.position.over(), [
								'I might be a hoe, but i have feelings',
							], () => {
								setTimeout(() => {
									this.localObjects.add(new MultiTextTyper(player.position.over(), [
										'I trust you.',
										'I will protect you queen',
									]))
								}, 200)
							}),
							Update(() => {
								if (!hoe.within(100, player)) {
									ForcePush(hoe).towards(player.position.center, 4)
								}
							}),
							Update(u => {
								if (player.within(1200, this.deliveryZone.position)) {
									Cam.zoom = 1.2

									Iterate(20, () => {
										this.enemies.add(new Enemy(Random.direction(player.position.offset(500).copy(), 100), player), e => {
											console.log('hei')
										})
									})

									console.log('adding one enemy')
									this.localObjects.add(
										new MultiTextTyper(player.position.over(), [
											'JEESUS ALLAHUUU AKBAAAR',
										])
									)
									this.localObjects.add(
										new MultiTextTyper(hoe.position.over(), [
											'holy shit',
										])
									)
									this.localObjects.remove(u)

									this.localObjects.add(Update(u => {
										if (this.enemies.objects.length == 0) {
											Cam.zoom = 1
											this.localObjects.remove(u)

											this.localObjects.add(
												new MultiTextTyper(hoe.position.over(), [
													'You analsexed them so hard',
												])
											)

											setTimeout(() => {
												this.localObjects.add(
													new MultiTextTyper(player.position.over(), [
														'i know. i have practiced',
													])
												)

											}, 400)
										}
									}))
								}
							}),
						])
					}

					completed() {
						return this.deliveryZone.completed()
					}

					update() {
						this.localObjects.update()
					}

					draw(draw, guiDraw) {
						this.localObjects.draw(draw, guiDraw)
					}

				}
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
