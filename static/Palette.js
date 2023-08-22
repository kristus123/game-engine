export class Palette {

	static width = window.innerWidth;
	static height = window.innerHeight;

	static main() {
		const canvas = document.getElementById("game")
		canvas.width = Palette.width
		canvas.height = Palette.height
		const ctx = canvas.getContext("2d")

		return { 
			canvas,
			ctx,
		}
	}

	static offscreen() {
		const canvas = new OffscreenCanvas(Palette.width, Palette.height);
		const ctx = canvas.getContext('2d');
		
		return { 
			canvas, 
			ctx,
		}
	}

	static clear(canvases) {
		canvases.forEach(c => {
			c.ctx.clearRect(0, 0, Palette.width, Palette.height)
			c.ctx.clearRect(0, 0, Palette.width, Palette.height)
		});
	}

	static apply(main, canvases) {
		canvases.forEach(c => {
			main.ctx.drawImage(c.canvas, 0, 0)
		});
	}

	
}
