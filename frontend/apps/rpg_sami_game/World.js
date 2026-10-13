export class World {
	constructor() {
		Dom.add(H.create("math-game"))

		this.objects = Objects([
		])
	}

	update() {
		this.objects.update()
	}
}
