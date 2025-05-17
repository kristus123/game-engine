export class DeliverBoxQuest {
	constructor() {
		this.localObjects = new LocalObjects([
			new ListLooper(Registry.ChickenBox, (box, next, finished) => {
				if (!G.storeWorker.touches(box)) {
					Move(G.storeWorker).towards(box)
				}
				else if (!box.touches(G.store)) {
					Move(G.storeWorker).towards(G.store)
					box.position.xy(G.storeWorker)
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
