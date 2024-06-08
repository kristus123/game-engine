export class SpinningPicture {
	constructor(position, imagePath, rotationIncrement = 0.01) {
		this.image = new Image()
		this.image.src = imagePath
		this.currentRotation = 0
	}

	draw(draw) {
		const newWidth = this.position.width;
		const newHeight = this.position.height;

		draw.ctx.save();

		draw.ctx.translate(this.position.position.center.x, this.position.position.center.y);
		this.currentRotation += this.rotationIncrement; // Increment the rotation
		draw.ctx.rotate(this.currentRotation); // Apply the current rotation

		draw.ctx.imageSmoothingEnabled = false;
		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);

		draw.ctx.restore();
	}
}

