export class Mouse {
	static position = new Position(0, 0)
	static screenPosition = new Position(0, 0)

	static initialize() {

		this.disabled = false

		this.up = true
		this.down = false
		this.downStopWatch = new StopWatch()

		this.onClick = () => {}
		this.onRightClick = () => {}

		this.rightUp = true
		this.rightDown = false

		this.moving = false
		this.lastPositionBeforeMoving = new Position(0, 0)
		this.timeSinceLastClick = 0

		document.addEventListener('mousemove', (e) => {
			this.positionRelativeToCamera(e)
			this.moving = true
			this.lastPositionBeforeMoving.x = this.position.x
			this.lastPositionBeforeMoving.y = this.position.y

			setTimeout(() => {
				this.moving = false
			}, 2)

		})

		document.addEventListener('wheel', e => {
			let delta = Math.sign(e.deltaY)

			if (delta > 0) {
				console.log('Scrolling out (down)')
				Call(this.scrollOut)
			}
			else {
				console.log('Scrolling in (up)')
				Call(this.scrollIn)
			}
		})

		document.addEventListener('mousedown', e => {
			if (this.disabled) {
				return
			}

			if (e.button == 0) { // Left click
				this.down = true
				this.up = false
				this.downStopWatch.start()
			}
			else if (e.button == 2) { // Right click
				this.rightDown = true
				this.rightUp = false
			}
		})

		document.addEventListener('mouseup', e => {

			if (e.button == 0) {
				this.up = true
				this.down = false
				this.downStopWatch.stop()
				this.downStopWatch.reset()
			}
			else if (e.button == 2) {
				this.rightUp = true
				this.rightDown = false
			}
		})

		document.addEventListener('click', e => {
			if (this.disabled) {
				return
			}

			console.log(e.button)

			if (e.button == 0) { // Left click
				this.onClick(this.screenPosition)
			}
		})

		document.addEventListener('contextmenu', e => {
			e.preventDefault()

			if (this.disabled) {
				return
			}
			else { // Right click
				this.onRightClick(this.screenPosition)
				console.log("user right lcicked")
			}
			
		})

		// Prevent right click to open menu
		// document.addEventListener('contextmenu', event => event.preventDefault())

		this.clickEvents = new ClickEvents()

		this.holding = null
		this.hoveringHtmlElement = false
	}

	static downForLongerThan(ms) {
		return this.down && this.downStopWatch.elapsedTime > ms
	}

	static addOnClick(name, handler) {
		this.clickEvents.addOnClick(name, handler)
	}

	static removeOnClick(name, handler) {
		this.clickEvents.removeOnClick(name, handler)
	}

	static positionRelativeToCamera(e) {
		this.screenPosition.x = e.clientX
		this.screenPosition.y = e.clientY

		// Apply inverse transformations for translation and zoom
		const inverseZoom = 1 / Cam.zoom

		const x =
				(e.clientX - Cam.offset.x) * inverseZoom +
				Cam.position.x
		const y =
				(e.clientY - Cam.offset.y) * inverseZoom +
				Cam.position.y

		this.position.x = x
		this.position.y = y

		return this.position.copy()
	}

	static clicked(o) {
		return Collision.between(this.position, o) && this.down
	}

	static click(o, timeInMs=20) {
		if (this.timeSinceLastClick > timeInMs && Mouse.down) {
			this.timeSinceLastClick = 0
			return this.clicked(o)
		}
		else {
			return false
		}
	}

	static hovering(o) {
		if (o instanceof HTMLElement) {
			return o.contains(document.querySelector(':hover'));
		}
		else {
			return Collision.between(this.position, o)
		}
	}

	static update() {
		this.timeSinceLastClick += 1
	}

	static holdAndMove(object) {
		if (this.holding && this.down) {
			this.holding.x = this.position.x
			this.holding.y = this.position.y
		}
		else if (this.up) {
			this.holding = null
		}
		else if (this.clicked(object)) {
			this.holding = object
		}
	}

	static draw(draw, guiDraw) {

		// console.log(this.moving)

		draw.circle(this.position)
		// draw.new_circle(this.position)
	}

}
