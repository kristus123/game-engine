export class World {
	constructor() {
		Dom.add(Html.matte())

		this.objects = Objects([
		])
	}

	update() {
		this.objects.update()
	}
}
