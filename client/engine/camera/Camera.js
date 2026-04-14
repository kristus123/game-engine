export class Camera {
	static initialize() { // initialize() Mouse first

		this.palettes = {
			d1: Palette.offscreen(),
			d2: Palette.offscreen(),
			d3: Palette.offscreen(),
		}

		this.objectToFollow = Entity(WorldPosition(0, 0, 1, 1), 1, 1)

		this.position = this.objectToFollow.position.smooth()
		this.zoom = 1 // used some places
	}

	static get offset() {
		return {
			x: Screen.width / 2,
			y: Screen.height / 2,
		}
	}

	static context(run) {
		this.position.update()

		LowLevelCamera.context(this, run)
	}

	static follow(o) {
		this.objectToFollow = o
		this.position = o.position.smooth()
	}

	static goTo(o) { // this is wrong
		this.objectToFollow.x = o.x
		this.objectToFollow.y = o.y
	}

	static followInstantly(o) {
		this.objectToFollow = o

		this.position.x = o.x
		this.position.y = o.y
	}

}
