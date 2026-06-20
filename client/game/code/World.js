export class World {
	constructor() {
		this.normalObjects = Objects([
			this.normalBush = Sprite.bush(WorldPosition(0, -256))
		])

		this.slicedObjects = Objects([
			SpriteSlicer.slice(Sprite.bush(WorldPosition(0, 0)), 2, 2)
		])

		SpriteSlicer.shuffle(this.slicedObjects.objects[0])
		
		Quest([
			Task({
				name: "get berries",
				start: () => {
					let berriesFound = 0
					
					return {
						markDoneIf: () => berriesFound >= 5,
						update: () => {
							
						},
					}
				},
			}),
		])
	}

	update() {
		this.normalObjects.update()
		this.slicedObjects.update()
	}
}
