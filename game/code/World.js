// ClientId(

export class World {
	constructor() {
		const player = new DynamicGameObject(new Position(8000, 6000))
		this.player=player

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0, 0), 6),
			Sprite.samurai(player.position, 0.5),
		])
	}


	update() {
		this.localObjects.update()
		const x = Ui.floating(Html.p('Hei'), this.player.position)
	}

	draw(draw) {}
}
