export class RunAll {
	constructor(classes) {
		this.classes = classes
	}

	update() {
		this.classes.forEach(e => {
			try {
				if (e.update) {
					e.update()
				}
			}
			catch(error) {
				throw new Error('an error occurred while running "update" method for '
					+ e.constructor.name + '  ' + error)
			}
		})
	}

	draw(ctx) {
		this.classes.forEach(e => {
			try {
				if (e.draw) {
					e.draw(ctx)
				}
			}
			catch(error) {
				throw new Error('an error occurred while running "draw" method for '
					+ e.constructor.name + '  ' + error)
			}
		})
	}


	add(c) {
		this.classes.push(c)
	}

	remove(c) {
		List.remove(this.classes, c)
	}
}
