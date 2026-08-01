export class Player extends Entity {
	constructor(position) {
		super(position)

		this.msg = Dom.add(H.p("click <key>E</key>")).floating()
		this.vinn = Dom.add(H.p("Vinn <strong>50</strong> kroner")).floating()

		this.objects = Objects([
			this.coin = Sprite.coin(WorldPosition(500, 600)),
			this.sprite = Sprite.player(this.position),
			this.farmer = Sprite.farmer(WorldPosition(500, 700)),
			OnTrue(() => Keyboard.one, () => {
				this.msg.text(`
				Velg
				<span style="color:blue;">BLUE</span>
				eller
				<span style="color:red;">RED</span>
				`).css("font-size:50px;")
				this.msg.show()
			}),

			OnTrue(() => Keyboard.two, () => {
				this.msg.hide()

				this.coin.playTag("spinning")

				setTimeout(() => {
					this.msg.text(`
					<span style="color:blue;">BLUE</span>
					`).css("font-size:50px;")
					this.msg.show()
					this.farmer.playTag("happy")
				}, 1500)
			}),

			OnTrue(() => Keyboard.three, () => {
				this.msg.hide()

				this.coin.playTag("spinning")

				setTimeout(() => {
					this.msg.text(`
					<span style="color:red;">RED</span>
					`).css("font-size:50px;")
					this.farmer.playTag("happy")
					this.msg.show()
				}, 1500)

			}),
		])

		this.light = Light.add(this.collider.center, 600, "255,165,0", 0, 5)
	}

	get collider() {
		return this.sprite.collider
	}

	update() {
		this.objects.update()
		this.msg.worldPosition(this.position)
		this.vinn.worldPosition(this.position.offset(0, 200))
	}
}
