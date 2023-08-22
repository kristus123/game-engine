import { Palette } from '/static/Palette.js';


export class Camera {
	constructor() {
		this.palette = Palette.offscreen()

		this.objectToFollow = {
			x:0,
			y:0,
		}

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
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
		this.palette.ctx.save()

		run()

		this.palette.ctx.restore()
	}

	follow(objectToFollow) {
		this.objectToFollow = objectToFollow

		this.palette.ctx.translate(
			-objectToFollow.x * this.zoom + this.offset.x,
			-objectToFollow.y * this.zoom + this.offset.y)
		this.palette.ctx.scale(this.zoom, this.zoom)
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
