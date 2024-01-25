export class Palette {
	static width = window.innerWidth
	static height = window.innerHeight

	static main() {
		const canvas = document.getElementById('game')
		canvas.width = Palette.width
		canvas.height = Palette.height
		const ctx = canvas.getContext('2d')

		return {
			canvas,
			ctx,
			width: Palette.width,
			height: Palette.height,
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

	static fill(ctx, color, position) {
		// var gradient = ctx.createLinearGradient(-position.x, -position.y, Palette.width, Palette.height);
		
		// var x = position.x
		// var y = position.y

		// var gradient = ctx.createRadialGradient(
		// 	-x + Palette.height, -y + Palette.height, 0,
		// 	-x + Palette.height, -y + Palette.height, 100
		// )

		// gradient.addColorStop(0, "#1d2856");
		// gradient.addColorStop(0.5, "red");
		// gradient.addColorStop(1, "#160a1f");



    ctx.globalCompositeOperation = 'source-over';

    // Draw your existing content here (if any)

    // Set the global composite operation to 'destination-in'
    ctx.globalCompositeOperation = 'destination-in';

    // Create the radial gradient
    var x = position.x;
    var y = position.y;

    var gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, 100
    );

    gradient.addColorStop(0, "#1d2856");
    gradient.addColorStop(0.5, "red");
    gradient.addColorStop(1, "#160a1f");

    // Draw the gradient as a mask
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, Palette.width, Palette.height);


		// // ctx.fillStyle = gradient;
		// ctx.fillRect(0, 0, Palette.width, Palette.height)
	}

static test(ctx, color, position) {
}

}
