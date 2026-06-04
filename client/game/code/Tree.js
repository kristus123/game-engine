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
		
			const centerTreeX =
				treeCollider.x + treeCollider.width * 0.5
			const centerTreeY =
				treeCollider.y + treeCollider.height * 0.5

			const centerPlayerX =
				playerCollider.x + playerCollider.width * 0.5
			const centerPlayerY =
				playerCollider.y + playerCollider.height * 0.5

			let pushX
			let pushY

			if (centerPlayerX < centerTreeX) {
				pushX = -overlapX
			} else {
				pushX = overlapX
			}

			if (centerPlayerY < centerTreeY) {
				pushY = -overlapY
			} else {
				pushY = overlapY
			}

			if (overlapX < overlapY) {
				G.player.position.x += pushX
				G.player.velocity.x = 0
			} else {
				G.player.position.y += pushY
				G.player.velocity.y = 0
			}
		}

		D1.box(this.sprite.collider)
		D1.box(G.player.sprite.collider)
	}

}
