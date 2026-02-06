export class World {
	constructor() {
		this.wood = 0

		this.snow = Sprite.snow(D2, Position(0, 0), 7)

		this.objects = Objects([
			this.player = DynamicGameObject(Position(700, 700)),
			this.a = Sprite.goat(D2, this.player.position),
			Sprite.light(D1, this.player.position.offset(), 2),
			OnTrue(() => Keyboard.f, () => {
				if (this.wood >= 3) {
					this.objects.add(Sprite.fire(D1, this.player.position.copy(), 2))
					this.wood -= 3
				}
				else {
					Html.p('you need more wood', 'big').floating().dom().position(this.player.position.offset(-200, -200)).animate('fade-away')
				}
			})
		])

		this.a.tags.idle.loop()

		Camera.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()
		this.snow.layers.trees.draw(D1)
		this.snow.layers.background.draw(D3)

		this.snow.tilemaps.tiles.forEach(t => {
			if (t.index == 1) {
				if (this.player.touches(t.position)) {
					D1.transparentGreenRectangle(t.position)

					D1.text(this.player, 'e')
					if (Keyboard.e) {
						t.erase()
						Html.p('+1', 'big').floating().dom().position(this.player.position.offset(-200, -200)).animate('fade-away')
						this.wood += 1
						console.log(this.wood)
					}
				}
			}
		})
	}
}
