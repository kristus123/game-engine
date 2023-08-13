class Camera {
	constructor() {
		this.objectToFollow = {
			x: 0,
			y: 0,
		}

		this.offset = {
			x: 1280 / 2,
			y: 720 / 2,
		}
	}

	follow(ctx, objectToFollow) {
		this.objectToFollow = objectToFollow

		ctx.translate(-objectToFollow.x + this.offset.x, -objectToFollow.y + this.offset.y);
	}

	mousePosition(ctx, canvas, event) {
		const rect = canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		// To account for the translation, subtract the translation values
		const translatedMouseX = mouseX - ctx.getTransform().e;
		const translatedMouseY = mouseY - ctx.getTransform().f;

		// Draw a dot at the mouse position
		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.arc(translatedMouseX, translatedMouseY, 5, 0, 2 * Math.PI);
		ctx.fill();
		
		// Display the coordinates
		ctx.fillStyle = 'red';
		ctx.fillText(`X: ${translatedMouseX}, Y: ${translatedMouseY}`, 10, canvas.height - 10);

		return {
			x:translatedMouseX + this.objectToFollow.x - this.offset.x,
			y:translatedMouseY + this.objectToFollow.y - this.offset.y,
		}
	}

	update() {
		
	}

	draw(ctx) {
		
	}
	
}
