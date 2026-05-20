export class Reindeer extends Entity {
	constructor() {
		super(Random.direction(WorldPosition(1000, 2000), 1000))

		this.objects = Objects([
			Sprite.reindeer(this.position).loopTag("run"),
		])

		this.speed = Random.integerBetween(1, 10)
	}

	update() {
		this.position.x += this.speed

		this.objects.update()
	}

}
