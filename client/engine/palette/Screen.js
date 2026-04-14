export class Screen {

	static get width() {
		return window.innerWidth
	}

	static get height() {
		return window.innerHeight
	}

	static onResize(callback) {
		window.addEventListener("resize", () => {
			callback(this.width, this.height)
		});
	}
}
