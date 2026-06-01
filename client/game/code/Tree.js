export class Tree extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.tree(this.position),
		])
	}

	update() {
		this.objects.update()

		if (this.sprite.collider.touches(G.player.sprite.collider)) {
			G.player.position.x = G.player.previousPosition.x
			G.player.position.y = G.player.previousPosition.y
		}

		D1.box(this.sprite.collider)
		D1.box(G.player.sprite.collider)
	}

}
