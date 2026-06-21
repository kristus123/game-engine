export class Player extends Entity {
	constructor(position) {
		super(position)

		this.msg = Dom.add(H.p("click <key>E</key>")).floating()

		this.objects = Objects([
			this.sprite = Sprite.player(this.position),
			OnTrue(() => Keyboard.e, () => {
				this.msg.hide()
				this.light.intensity = 0.1
			})
		])

		this.light = Light.add(this.collider.center, 600, "255,165,0", 0, 5)
	}

	get collider() {
		return this.sprite.collider
	}

	update() {
		this.objects.update()
		this.msg.worldPosition(this.position)
	}
}
