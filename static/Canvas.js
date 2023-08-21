export class Canvas {

	static width = window.innerWidth;
	static height = window.innerHeight;

	static main() {
		const canvas = document.getElementById("game")
		canvas.width = Canvas.width
		canvas.height = Canvas.height
		const ctx = canvas.getContext("2d")

		return { 
			canvas,
			ctx,
		}
	}

	static offscreen() {
		const canvas = new OffscreenCanvas(Canvas.width, Canvas.height);
		const ctx = canvas.getContext('2d');
		
		return { 
			canvas, 
			ctx,
		}
	}

	static clear(canvases) {
		canvases.forEach(c => {
			c.ctx.clearRect(0, 0, Canvas.width, Canvas.height)
			c.ctx.clearRect(0, 0, Canvas.width, Canvas.height)
		});
	}

	static apply(main, canvases) {
		canvases.forEach(c => {
			main.ctx.drawImage(c.canvas, 0, 0)
		});
	}

	
}
