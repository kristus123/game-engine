export class LoadExtensions {
	constructor(extensions) {
		this.extensions = extensions
	}

	update() {
		this.extensions.forEach(e => {
			e.update()
		})
	}

	draw(ctx) {
		this.extensions.forEach(e => {
			e.draw(ctx)
		})
	}
	
}
