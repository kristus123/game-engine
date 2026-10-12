class Flake extends Entity {

	constructor(p) {
		super(p)

		this.altitude = 800
		this.size = Random.floatBetween(10, 20)
		this.friction = 0
		this.velocity.x = Random.floatBetween(0, 0)
		this.velocity.y = Random.floatBetween(0, 0)

		this.position.width = this.size
		this.position.height = this.size
	}

	update() {
		this.altitude = Math.max(0, this.altitude - 150 * DeltaTime.value)
		const size = this.size * (0.2 + 0.8 * this.altitude / 400)
		this.position.width = size
		this.position.height = size

		if !this.landed {
			D1.rectangle({
				x: this.x,
				y: this.y - this.altitude,
				width: size,
				height: size,
			}, "white")
		}
	}

	get landed() {
		return this.altitude == 0
	}

	dispose() {
		Physics.objects.remove(this)
		SuperClass.all.remove(this)
		SuperClass.all.remove(this.position.center)
		SuperClass.all.remove(this.position)
	}

}

export class Snow {
	constructor(importantPosition) {
		this.flakes = []
		this.groundSnow = new Map()
		this.spawnRemainder = 0
	}

	update() {
		for let i = this.flakes.length - 1; i >= 0; i-- {
			const f = this.flakes[i]
			f.update()

			if f.landed {
				// Keep one permanent deposit per small ground cell.
				const key = `${Math.floor(f.x / 8)},${Math.floor(f.y / 8)}`
				if !this.groundSnow.has(key) {
					this.groundSnow.set(key, {
						x: f.x,
						y: f.y,
						width: f.width,
						height: f.height,
					})
				}
				f.dispose()
				this.flakes.splice(i, 1)
			}
		}

		this.spawnRemainder += DeltaTime.value * 60
		while (this.spawnRemainder >= 1) {
			this.flakes.push(new Flake(Random.direction(this.importantPosition, 800)))
			this.spawnRemainder -= 1
		}

		for const position of this.groundSnow.values() {
			D2.rectangle(position, "white")
		}
	}

}
