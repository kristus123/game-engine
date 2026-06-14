export class World {
	constructor() {
		// TEST: Sprite Copy

		// this.objects = Objects([
		// 	this.x = Sprite.bush(WorldPosition(0, 0)),
		// 	this.y = this.x.copy()
		// ])

		// this.y.position = WorldPosition(
		// 	this.y.position.x + 500,
		// 	this.y.position.y,
		// 	this.y.position.width,
		// 	this.y.position.height
		// )

		// TEST: Slice And Shuffle

		this.normalObjects = Objects([
			this.normalBush = Sprite.bush(WorldPosition(0, -256))
		])

		// TODO: Fix Scaling Bug

		this.slicedObjects = Objects([
			SpriteSlicer.slice(Sprite.bush(WorldPosition(0, 0)), 2, 2)
		])

		SpriteSlicer.shuffle(this.slicedObjects.objects[0])
	}

	update() {
		this.normalObjects.update()
		this.slicedObjects.update()
	}
}
