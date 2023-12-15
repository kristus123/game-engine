export class LoadExtensions {
	constructor(runningFrom, extensions) {
		this.runningFrom = runningFrom
		this.extensions = extensions
	}

	update() {
		this.extensions.forEach(e => {
			try {
				e.update()
			}
			catch(error) {
				throw new Error('an error occurred while running "update" method for ' + e.constructor.name + ' in ' + this.runningFrom.constructor.name + " " + error)
			}
		})
	}

	draw(ctx) {
		this.extensions.forEach(e => {
			e.draw(ctx)
		})
	}
	
}
