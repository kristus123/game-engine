export class RecordMovement {
	constructor(object, mouse) {
		this.object = object
		this.mouse = mouse

		this.originalX = this.object.x
		this.originalY = this.object.y

		this.actions = []
		this.stringifiedActions = ""
		this.index = 0
		this.record = false

		new KeypressEvent().addKeyDownListener('a', () => {
			this.record = !this.record

			if (this.record) {
				this.actions = []
				this.stringifiedActions = ""
			}
			else {
				Clipboard.paste(this.stringifiedActions)
				console.log("copied to clipboard")

				this.object.x = this.originalX
				this.object.y = this.originalY
				this.index = 0
			}
		})
	}

	update() {
		console.log(this.record)
		if (List.validIndex(this.actions, this.index)) {
			this.actions[this.index]()
			this.index++
		}

		if (this.recording) {
			
		}
	}

	record() {
		const c = this.mouse.position.copy()
		const a = () => Push(this.object).towards(c, 1)	

		this.actions.push(a)
		a()

		this.stringifiedActions += `Push(this.object).towards(new Position(${c.x}, ${c.y}), 60)`
		this.stringifiedActions += "\n"
	}
}
