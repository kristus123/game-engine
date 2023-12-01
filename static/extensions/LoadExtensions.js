export class LoadExtensions {
	constructor(extensions) {
		this.extensions = extensions
	}

	update() {
		this.extensions.forEach(e => {
			try {
				e.update()
			}
			catch(error) {
				console.log('an error occurred while running "update" method for ' + e.constructor.name)
			}
		})
	}

	draw(ctx) {
		this.extensions.forEach(e => {
			e.draw(ctx)
		})
	}
	
}
