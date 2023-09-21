import { GameObject } from '/static/scripts/GameObject.js';
import { PrettyParticles } from '/static/scripts/PrettyParticles.js'
export class Spaceship extends GameObject {

	constructor() {
		super(-500, 0, 100, 100, 10, 25)
		this.maxHeight = 100;
		this.maxWidth = 300;
		this.activeRadius = 80;
		this.image = new Image();
		this.engineFlare = new PrettyParticles()
	};

	update() {
	};

	draw(ctx) {
		this.image.src = "https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png";
		this.engineFlare.updateAndDraw(ctx, this.x, this.y)

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

		const rotationAngle = Math.atan2(this.velocity.y, this.velocity.x);
		ctx.rotate(rotationAngle);

		const at90Degree = Math.PI / 2;
		ctx.rotate(at90Degree);

		ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
		ctx.restore();
	};

};
