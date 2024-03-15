export class Blur {
    constructor(camera) {
	this.canvas = camera.palette.canvas;
	this.ctx = camera.palette.ctx;

      this.pixelSize = 200;
    }

    draw(draw, guiDraw) {
      for (let x = 0; x < this.canvas.width; x += this.pixelSize) {
        for (let y = 0; y < this.canvas.height; y += this.pixelSize) {
			const color = Random.choice(["red", "blue", "orange", "green"])
          this.ctx.fillStyle = color;
			guiDraw.new_rectangle(new Position(x, y, 10, 10), color)
        }
      }
    }
  }
