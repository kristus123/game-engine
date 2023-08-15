class Draw {
	static rectangle(ctx, x, y, width, height) {
		ctx.fillStyle = "orange"
		ctx.fillRect(x, y, width, height)

		ctx.strokeStyle = "white"
		ctx.lineWidth = 4;
		ctx.strokeRect(x, y, width, height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"
	}

	static circle(ctx, x, y, radius, color) {
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2, false)
		ctx.fillStyle = color
		ctx.fill()
	}

	// todo must be updated somehow iwthin game lloop
	static circleSpinning(ctx, objectToFollow, radius) {
		let angle = 0

		const circleX = objectToFollow.x + objectToFollow.width / 2 + radius * Math.cos(angle);
		const circleY = objectToFollow.y + objectToFollow.height / 2 + radius * Math.sin(angle);

		Draw.circle(ctx, circleX, circleY, 10, "red");

		angle += 0.25
	}

	static lineBetween(ctx, start, end) {
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}



	static text(ctx, x, y, width, height, text) {
		Draw.rectangle(ctx, x, y, width, height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"
		ctx.fillText(text, x + 20, y + height / 2)
	}


}
