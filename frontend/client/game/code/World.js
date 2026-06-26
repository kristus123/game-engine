export class World {
	constructor() {
		this.normalObjects = Objects([
			this.normalBush = Sprite.bush(WorldPosition(0, -256))
		])

		this.slicedObjects = Objects([
			SpriteSlicer.slice(Sprite.bush(WorldPosition(0, 0)), 2, 2)
		])

		SpriteSlicer.shuffle(this.slicedObjects.objects[0])

		Mouse.onClick = () => {
			Mix.fx.play(Sound.click)
			Mix.master.play(Sound.placeDirt)
		}

		Gp.left = () => {
			Gp.vibrate()
		}
	}

	update() {
		this.normalObjects.update()
		this.slicedObjects.update()
	}
}

