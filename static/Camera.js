import {Canvas} from "/static/Canvas.js"

export class Camera {
	constructor(contextsLinkedToCamera) {
		this.contextsLinkedToCamera = contextsLinkedToCamera

		this.objectToFollow = {
			x:0,y:0
		}

		this.offset = {
			x: Canvas.width / 2,
			y: Canvas.height / 2,
		}

		this.currentMousePosition = {
			x: 0,
			y: 0,
		}

		this.zoom = 1

		document.addEventListener('mousemove', (e) => {
			this.currentMousePosition = this.mousePosition(e)
		})
	}

	context(run) {
		this.contextsLinkedToCamera
			.forEach(c => c.save())

		run()

		this.contextsLinkedToCamera
			.forEach(c => c.restore())
	}

	positionRelativeToScreen() {
		return {
			x: this.objectToFollow.x - this.offset.x,
			y: this.objectToFollow.y - this.offset.y,
		}
	}

	follow(objectToFollow) {
		this.objectToFollow = objectToFollow

		for (const c of this.contextsLinkedToCamera) {
			c.translate(
				-objectToFollow.x * this.zoom + this.offset.x,
				-objectToFollow.y * this.zoom + this.offset.y)
			c.scale(this.zoom, this.zoom)
		}
	}

	translate() {
		return {
			x: -this.objectToFollow.x * this.zoom + this.offset.x,
			y: -this.objectToFollow.y * this.zoom + this.offset.y,
		} 	
	}

	mousePosition(e) {
		const mouseX = e.clientX
		const mouseY = e.clientY

		// Apply inverse transformations for translation and zoom
		const inverseZoom = 1 / this.zoom;
			
		return {
			x: (mouseX - this.offset.x) * inverseZoom + this.objectToFollow.x,
			y: (mouseY - this.offset.y) * inverseZoom + this.objectToFollow.y,
		}
	}
	
}
