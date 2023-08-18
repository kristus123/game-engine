class Camera {
	constructor(width, height) {
		this.offset = {
			x: width / 2,
			y: height / 2,
		}

		this.currentMousePosition = {
			x: 0,
			y: 0,
		}

		this.zoom = 0.5
	}

	positionRelativeToScreen() {
		return {
			x: this.objectToFollow.x - this.offset.x,
			y: this.objectToFollow.y - this.offset.y,
		}
	}

	follow(contexts, objectToFollow) {
		this.objectToFollow = objectToFollow

		for (const c of contexts) {
			c.translate(
				-objectToFollow.x * this.zoom + this.offset.x,
				-objectToFollow.y * this.zoom + this.offset.y)
			c.scale(this.zoom, this.zoom)
		}
	}

	mousePosition(canvas, e) {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Apply inverse transformations for translation and zoom
		const inverseZoom = 1 / this.zoom;
			
		return {
			x: (mouseX - this.offset.x) * inverseZoom + this.objectToFollow.x,
			y: (mouseY - this.offset.y) * inverseZoom + this.objectToFollow.y,
		}
	}

	update() {
		
	}

	draw(ctx) {
		
	}
	
}
