import { GameObject } from "/static/scripts/GameObject.js"
export class Player extends GameObject {

	constructor() {
		super(0, 0, 25, 100, 100, 10)
		this.maxHeight = 100;
		this.maxWidth = 25;
		this.activeRadius = 40;
		this.image = new Image();
		this.image.src = "https://www.nicepng.com/png/full/343-3434119_overworld-pokemon-trainer-fusion-with-hydreigon-pokemon-red.png";
	};

	update() {
	};

	draw(ctx) {
		const aspectRatio = this.image.width / this.image.height;
		const maxWidth = this.maxWidth;
		const maxHeight = this.maxHeight;
		
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
