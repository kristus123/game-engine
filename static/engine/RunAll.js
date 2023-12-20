export class RunAll {
	constructor(runningFrom, extensions) {
		this.runningFrom = runningFrom
		this.extensions = extensions
	}

	update() {
		this.extensions.forEach(e => {
			try {
				if (e.update) {
					e.update()
				}
			}
			catch(error) {
				throw new Error('an error occurred while running "update" method for '
					+ e.constructor.name + ' in ' + this.runningFrom.constructor.name + ' ' + error)
			}
		})
	}

	draw(ctx) {
		this.extensions.forEach(e => {
			try {
				if (e.draw) {
					e.draw(ctx)
				}
			}
			catch(error) {
				throw new Error('an error occurred while running "draw" method for '
					+ e.constructor.name + ' in ' + this.runningFrom.constructor.name + ' ' + error)
			}
		})
	}
}
