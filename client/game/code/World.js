export class World {
	constructor(test1, {wow, two} = {}, {akjsldkf, asdlkf}, {thisone}, ...args) {
		this.normalObjects = Objects([
			this.normalBush = Sprite.bush(WorldPosition(0, -256))
		])

		this.slicedObjects = Objects([
			SpriteSlicer.slice(Sprite.bush(WorldPosition(0, 0)), 2, 2)
		])

		SpriteSlicer.shuffle(this.slicedObjects.objects[0])
	}

	update(test1, {wow, two} = {}, {akjsldkf, asdlkf}, {thisone}, ...args) {
		this.normalObjects.update()
		this.slicedObjects.update()
	}
}
