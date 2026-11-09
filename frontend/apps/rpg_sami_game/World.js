export class World {
	constructor() {
		Dom.add(H.create("math-page"))

		this.objects = Objects([
		])
	}

	update() {
		this.objects.update()
	}
}
