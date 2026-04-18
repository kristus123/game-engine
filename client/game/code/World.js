export class World {
	constructor() {
		// Page.go(PracticePage)

		const html = F.test
		console.log(html)
		html.domFloat({ x: 100, y: 100 })

		this.viking = Sprite.viking(WorldPosition(-800, 0))
		this.player = Sprite.player(WorldPosition(200, 300))
	}

	update() {
		this.viking.update()
		this.player.update()
	}
}
