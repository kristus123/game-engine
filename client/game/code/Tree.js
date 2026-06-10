export class Tree extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.tree(this.position),
		])
		console.log(this.sprite.collider)
	}

	update() {
		this.objects.update()

		// D1.box(this.sprite.collider)
		// D1.box(G.player.sprite.collider)
	}

}
