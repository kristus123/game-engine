export class World {
	constructor() {
		// Page.go(PracticePage)

		// Out.js Test
		console.log(window.mediasoup)

		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			// this.oldSami = Sprite.oldSami(WorldPosition(1483 - 200, 2215 - 200)),
			Sprite.fireplace(WorldPosition(1512, 2100)),
			this.player = Player(WorldPosition(1800, 2100)),
			...Iterate(0, () => {
				const r = Sprite.rain(Random.direction(this.player.position, 2000))
				return {
					update() {
						r.update()
					}

				}
			}),
			Quest([
				() => {
					const d = Dialogue(this.player.position, [
						{ text: "We need some berries. go pick some!", sleepEnd: 100 },
					])

					return {
						completed: () => {
							return d.completed
						},
						update: () => {
							d.update()
						},
					}
				},
				() => {
					const d = Dialogue(this.player.position.offset(0, -20), [
						{ text: "i need to find berries", sleepEnd: 100 },
					])

					return {
						completed: () => {
							return d.completed
						},
						update: () => {
							d.update()
						},
					}
				},
			])
		])

		Camera.follow(this.player)
		Controller.control(this.player)

		setTimeout(() => {
			this.player.sprite.playTag("magic")
		}, 2000)

	}

	update() {
		this.objects.update()

		D1.text(Mouse.position, `${Mouse.x} ${Mouse.y}`)
	}
}
