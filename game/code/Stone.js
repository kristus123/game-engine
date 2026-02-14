export class Stone extends Entity {
	constructor(position) {
		super(position)
		this.objects = Objects([

		])
	}

	update() {
		D1.box(this.position)
	}
}
