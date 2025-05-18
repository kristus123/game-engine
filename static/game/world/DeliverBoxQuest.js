export class DeliverBoxQuest {
	constructor() {
		this.localObjects = new LocalObjects([
			new ListLooper(Registry.ChickenBox, (box, next, finished) => {
				if (!G.storeWorker.touches(box)) {
					Move(G.storeWorker).towards(box)
				}
				else if (G.player.pickUpBox.holding) {
					Move(G.storeWorker).towards(G.player)
				}
				else if (!box.touches(G.store)) {
					Move(G.storeWorker).towards(G.store)
					box.position.xy(G.storeWorker)
				}

				if (G.storeWorker.touches(G.player)) {
					ForcePush(G.player).awayFrom(G.store, 7)
					Controller.disable(200)
					G.player.pickUpBox.drop()
				}

				if (box.touches(G.store)) {
					Html.fadeaway('box delivered', G.storeWorker)
					next()
				}
			})
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
