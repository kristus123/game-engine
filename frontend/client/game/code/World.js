export class World {
	constructor() {
		G.player = Player(WorldPosition(950, 420))
		G.oldSami = OldSami(WorldPosition(730, 600))

		const html = Dom.add(Html.test())


		const b = Dom.floating(H.button("hei"))
		DomMouse.onMove = (x, y) => {
			b.followMouse(0, b.offsetHeight)
		}

		html.openChat.onClick(() => {
			html.chat.show()
		})

		html.closeChat.onClick(() => {
			html.chat.hide()
		})

		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),

			Sprite.fireplace(WorldPosition(500, 400)),

			DemoQuest(),

			G.player,
			G.oldSami,
		])

		Controller.control(G.player)
		Camera.follow(G.player)
	}

	update() {
		this.objects.update()
	}
}
