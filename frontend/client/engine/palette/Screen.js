export class Screen {

	static get width() {
		return window.innerWidth
	}

	static get height() {
		return window.innerHeight
	}

	static onResize(callback) {
		// in the future all addEventListener should be moved into one file, to make it easy to keep track of which event listeners are used.
		window.addEventListener("resize", () => {
			callback(this.width, this.height)
		})
	}
}
