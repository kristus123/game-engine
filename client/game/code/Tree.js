export class Tree extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.tree(this.position),
		])
	}

	update() {
		this.objects.update()

		// Collision.js is a reference

		D1.box(this.sprite.collider)
		D1.box(G.player.sprite.collider)
	}

}
