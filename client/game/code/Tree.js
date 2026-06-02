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

		
		if (this.sprite.collider.touches(G.player.sprite.collider)) {
			const treeCollider = this.sprite.collider
			const playerCollider = G.player.sprite.collider
			
			const overlapX = Math.min(treeCollider.x + treeCollider.width - playerCollider.x,
									  playerCollider.x + playerCollider.width - treeCollider.x)

			const overlapY = Math.min(treeCollider.y + treeCollider.height - playerCollider.y,
									  playerCollider.y + playerCollider.height - treeCollider.y)
			
			if (overlapX < overlapY) {
				G.player.position.x = G.player.previousPosition.x
			} else if (overlapX > overlapY) {
				G.player.position.y = G.player.previousPosition.y
			}
		}

		D1.box(this.sprite.collider)
		D1.box(G.player.sprite.collider)
	}

}
