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
