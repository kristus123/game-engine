function init(connectedClass, objects) {
	const localObjects = new LocalObjects()

	for (const object of objects) {
		const instanceField = Object.keys(object)[0]
		const thing = object[instanceField]

		connectedClass[instanceField] = thing
		localObjects.add(thing)
	}

	return localObjects
}

function update(update) {
	return {update}
}

export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		const sword = new Sword(this.player, [])

		this.localObjects = new LocalObjects([
			this.player,
			// sword,
			init(this, [
				{ enemies: new LocalObjects() },
			]),
			update(() => {
				for (const e of this.enemies.objects) {
					if (e.touches(this.player)) {
						// Push(this.player).awayFrom(e, 100)
					}
				}
			}),
			new StaticPicture(new Position(-100, 0, 1700, 600), '/static/assets/houses.png'),
			new StaticPicture(new Position(-100, -1200, 1700, 600), '/static/assets/houses.png'),
			new CloudParallax(),
			new TalkToShopKeeper(this.player),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
