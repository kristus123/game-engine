export class Camera {
	static initialize() { // initialize() Mouse first

		const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
		}

		this.palettes = {
			d1: Palette.offscreen(() => {
				this.offset = {
					x: Palette.width / 2,
					y: Palette.height / 2,
				}
			}),
			d2: Palette.offscreen(() => {
				this.offset = {
					x: Palette.width / 2,
					y: Palette.height / 2,
				}
			}),
			d3: Palette.offscreen(() => {
				this.offset = {
					x: Palette.width / 2,
					y: Palette.height / 2,
				}
			}),
		}

		this.objectToFollow = Entity(WorldPosition(0, 0, 1, 1), 1, 1)

		this.position = null

		this.zoom = 1

		this.anchoredPositions = Objects([
			// Anchor(Mouse.position, 1_000, 0.1),
		])
	}

	static context(run) {
		this.position = this.objectToFollow.smooth
		this.position.targetPosition.x = this.objectToFollow.x
		this.position.targetPosition.y = this.objectToFollow.y

		this.position.update()

		this.anchoredPositions.update()

		LowLevelCamera.context(this, run)
	}

	static follow(o) {
		this.objectToFollow = o
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

	static p(p) { // Html.js hack
		return WorldPosition(
			(p.x - this.position.x) * this.zoom + this.offset.x,
			(p.y - this.position.y) * this.zoom + this.offset.y
		)
	}

	static coverObject(position) {
		const objRatio = position.width / position.height
		const viewRatio = Palette.width/ Palette.height

		if (objRatio > viewRatio) {
			this.zoom = Palette.height / position.height // fit height
		}
		else {
			this.zoom = Palette.width / position.width // fit width
		}

		this.zoom += 1.2


		const centerX = position.x + position.width / 2
		const centerY = position.y + position.height / 2

		this.follow(WorldPosition(centerX, centerY))

	}

}
