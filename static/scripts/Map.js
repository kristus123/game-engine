import { GameObject } from "/static/scripts/GameObject.js"
export class Map extends GameObject {

	constructor() {
		super(-500, 0, 1920, 1080, 0, 0)
		this.cellSize = 100;
		this.image = new Image();
	};

	update() {
	};

	draw(ctx) {
		this.image.src = "/static/assets/1920x1080.jpg";
		const aspectRatio = this.image.width / this.image.height;
		const maxWidth = this.width;
		const maxHeight = this.height;

		let newWidth = maxWidth;
		let newHeight = maxHeight;
		if (this.image.width > maxWidth) {
			newWidth = maxWidth;
			newHeight = newWidth / aspectRatio;
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight;
			newWidth = newHeight * aspectRatio;
		}

		ctx.save();
		ctx.translate(this.x, this.y);
		// const rotationAngle = Math.atan2(player.velocity.y, player.velocity.x);
		// ctx.rotate(rotationAngle);
		// ctx.rotate(Math.PI / 2); // 90 degrees

		ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
		ctx.restore();
	};
};
