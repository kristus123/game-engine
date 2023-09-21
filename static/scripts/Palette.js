export class Palette {

	static width = window.innerWidth;
	static height = window.innerHeight;

	static main() {
		const canvas = document.getElementById("game")
		canvas.width = this.width
		canvas.height = this.height
		const ctx = canvas.getContext("2d")

		return {
			canvas,
			ctx,
		}
	}

	static offscreen() {
		const canvas = new OffscreenCanvas(this.width, this.height);
		const ctx = canvas.getContext('2d');

		return {
			canvas,
			ctx,
		}
	}

	static clear(canvases) {
		canvases.forEach(c => {
			c.ctx.clearRect(0, 0, this.width, this.height) // do not need 2 ? remove
			c.ctx.clearRect(0, 0, this.width, this.height)
		});
	}

	static apply(mainPalette, palettes) {
		palettes.forEach(p => {
			mainPalette.ctx.drawImage(p.canvas, 0, 0)
		});
	}

	// use Draw.js method instead
	static fill(palette, color) {
		palette.ctx.fillStyle = color;
		palette.ctx.fillRect(0, 0, this.width, this.height)
	}

}
