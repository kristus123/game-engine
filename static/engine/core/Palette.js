export class Palette {
	static width = window.innerWidth
	static height = window.innerHeight

	static main() {
		const canvas = document.getElementById('game')
		canvas.width = Palette.width
		canvas.height = Palette.height
		const ctx = canvas.getContext('2d')

		// Create a Pixi application with the same dimensions as your existing canvas
		const app = new PIXI.Application({
			view: canvas,
			width: canvas.width,
			height: canvas.height,
			antialias: true, // optional
			transparent: true, // optional
			resolution: 1, // optional
		});

		return {
			canvas,
			ctx,
			width: Palette.width,
			height: Palette.height,
			app: app,
		}
	}

	static offscreen() {
		const canvas = new OffscreenCanvas(Palette.width, Palette.height)
		const ctx = canvas.getContext('2d')

		return {
			canvas,
			ctx,
			width: Palette.width,
			height: Palette.height,
		}
	}

	static clear(canvases) {
		canvases.forEach((c) => {
			c.ctx.clearRect(0, 0, Palette.width, Palette.height) // do not need 2 ? remove
			c.ctx.clearRect(0, 0, Palette.width, Palette.height)
		})
	}

	static apply(mainPalette, palettes) {
		palettes.forEach((p) => {
			mainPalette.ctx.drawImage(p.canvas, 0, 0)
		})
	}

	static fill(palette, color) {
		palette.ctx.fillStyle = color
		palette.ctx.fillRect(0, 0, palette.width, palette.height)
	}
}
