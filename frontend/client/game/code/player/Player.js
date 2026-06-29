export class Player extends Entity {
	constructor(position) {
		super(position)

		this.msg = Dom.add(H.p("click <key>E</key>")).floating()

		this.objects = Objects([
			this.sprite = Sprite.player(this.position),
		])

		this.light = Light.add(this.collider.center, 600, "255,165,0", 0, 5)
	}

	get collider() {
		return this.sprite.collider
	}

	update() {
		this.objects.update()
		this.msg.worldPosition(this.position)

		// Constrain player to world map bounds (6468 x 4548 pixels)
		const mapWidth = 6468
		const mapHeight = 4548
		const pc = this.collider

		if (pc.x < 0) {
			this.position.x -= pc.x
		}
		else if (pc.x + pc.width > mapWidth) {
			this.position.x -= (pc.x + pc.width - mapWidth)
		}

		if (pc.y < 0) {
			this.position.y -= pc.y
		}
		else if (pc.y + pc.height > mapHeight) {
			this.position.y -= (pc.y + pc.height - mapHeight)
		}
	}
}
