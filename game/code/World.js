// ClientId(

export class World {
	constructor() {
		this.x = Sprite.snow(Position(-0, 0), 7)
		this.objects = [
			this.x,
			this.x.tilemaps,
			this.player = DynamicGameObject(Position(8000, 8000)),
			Sprite.player(this.player.position),
		]

		Camera.followInstantly(this.player)
		Controller.control(this.player)

		this.p = Html.button('Good moning', () => {
			this.p.remove()
		})
			.addToDom()
			.floating()
	}

	update() {
		this.p.position(this.player)
		this.objects.update()
	}

	draw(draw) {}
}
