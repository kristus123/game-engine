export class Level {
	static {
		this.active = null
	}

	static change(level) {
		this.active = level
	}

	static update() {
		this.active.update()
	}

}
