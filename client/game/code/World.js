export class World {
	constructor() {
		// Page.go(PracticePage)

		const html = F.test
		html.domFloat({ x: 100, y: 100 })

		this.viking = Sprite.viking(WorldPosition(-800, 0))
		this.player = Sprite.player(WorldPosition(200, 300))

		this.world = Sprite.world(WorldPosition(0, 0))
		this.worldTileInfo = TileInfo.world(WorldPosition(0, 0))

		Controller.control(this.player)

		this.sky = Sprite.sky(WorldPosition(0, 0))
		Camera.follow(this.sky.position.center)
	}

	update() {
		this.viking.update()
		this.world.update()

		this.worldTileInfo.update()
		this.player.update()

		GamePad.update()

		this.sky.update()

		console.log(this.sky.getLayer('clouds').offset.x+=1)
	}
}
