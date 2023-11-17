export class Calculate {

	static objectThatIsCirclingAroundObjectBasedOnMousePosition(
		ctx,
		player,
		currentMousePosition,
	) {

		const angle = Math.atan2(currentMousePosition.y - player.y, currentMousePosition.x - player.x)

		const playerRadius = 20
		const circleRadius = 100

		const circleX =
			player.x + player.width / 2 + circleRadius * Math.cos(angle)
		const circleY =
			player.y + player.height / 2 + circleRadius * Math.sin(angle)

		// Draw.circle(ctx, circleX, circleY, playerRadius, 'red')

		return {
			x: circleX,
			y: circleY,
		}
	}


	static velocity(currentPosition, targetPosition, speed = 2) {
		const dx = targetPosition.x - currentPosition.x;
		const dy = targetPosition.y - currentPosition.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const velocityX = (dx / distance) * speed;
		const velocityY = (dy / distance) * speed;

		return { x: velocityX, y: velocityY };
	}

	static insideCircle(player, circle, radius) {
		const distance = Math.sqrt((player.x- circle.x) ** 2 + (player.y - circle.y) ** 2);
		return distance < radius;
	}
	
}
