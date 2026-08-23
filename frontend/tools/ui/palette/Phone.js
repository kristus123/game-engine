export class Phone {
	static get current() {
		if (window.innerWidth > window.innerHeight) {
			return "horizontal"
		}

		return "vertical"
	}

	static get horizontal() {
		return this.current == "horizontal"
	}

	static get vertical() {
		return this.current == "vertical"
	}

	static onChange(callback) {
	}

	static {
		// in the future all addEventListener should be moved into one file, to make it easy to keep track of which event listeners are used.
		window.addEventListener("resize", () => {
			// trigger resize
		})
	}
}
