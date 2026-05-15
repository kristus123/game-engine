export class World {
	constructor() {
		// Page.go(PracticePage)

		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			Sprite.fireplace(WorldPosition(1512, 2100)),
			this.player = Player(WorldPosition(1800, 2100)),
		])

		Camera.follow(this.player)
		Controller.control(this.player)

		this.b = F.talkBubble()
		this.b.text.splitLetters()
		this.b.text.forEach(c => {
			c.addClass('animate')
		})
	}

	update() {
		this.objects.update()

		this.b.worldFloat(WorldPosition(1512, 2100))

		D1.text(Mouse.position, `${Mouse.position.x} ${Mouse.position.y}`)
	}
}
