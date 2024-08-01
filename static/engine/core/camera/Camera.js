export class Camera {
	constructor() {
		this.lowLevelCamera = new LowLevelCamera()

		this.objectToFollow = new DynamicGameObject(new Position(0,0), 1, 1)

		this.localObjects = new LocalObjects([
			new Anchor(this, new Position(100, 100), 10000, 0.001)
		])

		this.zoom = 1
	}

	get palette() {
		return this.lowLevelCamera.palette
		
	}

	get offset() {
		return this.lowLevelCamera.offset
		
	}

	get position() {
		return this.lowLevelCamera.position
	}

	context(run) {
		this.lowLevelCamera.position.x = this.objectToFollow.position.center.x
		this.lowLevelCamera.position.y = this.objectToFollow.position.center.y

		this.localObjects.update()
		this.lowLevelCamera.context(run)
	}

	follow(o) {
		this.objectToFollow = o
	}

	goTo(o) {
		this.objectToFollow.x = o.x
		this.objectToFollow.y = o.y
	}

	followInstantly(o) {
		this.objectToFollow = o
		this.lowLevelCamera.position = o.position.copy()
	}
}

