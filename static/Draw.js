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

	// needs some work obviously, but it works
	static objectThatIsCirclingAroundObjectBasedOnMousePositionButBehind() {
		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1);
		}

		player.angle = 0
		const playerRadius = 20;
		const circleRadius = 50;
		const color = "blue";

		const oppositeAngle = player.angle + Math.PI
		const circleX = player.x + player.width / 2 + circleRadius * Math.cos(oppositeAngle);
		const circleY = player.y + player.height / 2 + circleRadius * Math.sin(oppositeAngle);
		Draw.circle(ctx, circleX, circleY, playerRadius, "red");

		player.angle = getAngle(player.x + player.width / 2, player.y + player.height / 2, camera.currentMousePosition.x, camera.currentMousePosition.y);

	}

	// needs some work obviously, but it works
	static objectThatIsCirclingAroundObjectBasedOnMousePosition() {
		player.angle = 0
		const playerRadius = 20;
		const circleRadius = 50;
		const color = "blue";

		const circleX = player.x + player.width /2 + circleRadius * Math.cos(player.angle);
		const circleY = player.y + player.height /2 + circleRadius * Math.sin(player.angle);

		Draw.circle(ctx, circleX, circleY, playerRadius, "red");

		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1);
		}

		player.angle = getAngle(player.x, player.y, camera.currentMousePosition.x, camera.currentMousePosition.y);
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
