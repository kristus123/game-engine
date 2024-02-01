class RecordMovement {
	constructor(object, mouse) {
		this.object = object
		this.mouse = mouse

		this.actions = []

		this.record = true

		this.originalX = this.x
		this.originalY = this.y

		setTimeout(() => {
			this.record = false
			this.x = this.originalX
			this.y = this.originalY
		}, 10_000);

		this.index = 0
	}


	update() {
		if (this.record) {
			const c = this.mouse.position.copy()
			const a = () => Push(this.object).towards(c, 20)
			this.actions.push(a)
			a()
			console.log("recording")
		}

		if (!this.record) {
			if (List.validIndex(this.actions, this.index)) {
				this.actions[this.index]()
				this.index++
			}
			console.log("replaying recording")
		}
	}
}
