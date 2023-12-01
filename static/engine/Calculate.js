export class Calculate {

	static directionBetween(player, currentMousePosition) {

		const angle = Math.atan2(currentMousePosition.y - player.y, currentMousePosition.x - player.x)

		const circleRadius = 100

		return {
			x: player.x + player.width / 2 + circleRadius * Math.cos(angle),
			y: player.y + player.height / 2 + circleRadius * Math.sin(angle),
		}
	}


	static velocity(currentPosition, targetPosition, speed = 2) {
		const dx = targetPosition.x - currentPosition.x
		const dy = targetPosition.y - currentPosition.y
		const distance = Math.sqrt(dx * dx + dy * dy)
		const velocityX = (dx / distance) * speed
		const velocityY = (dy / distance) * speed

		return { x: velocityX, y: velocityY }
	}

	static insideCircle(player, circle, radius) {
		const distance = Math.sqrt((player.x- circle.x) ** 2 + (player.y - circle.y) ** 2)
		return distance < radius
	}

	static withinAngle(origin, point, minAngle, maxAngle, length) {
		// Calculate the direction vector from origin to point
		const direction = {
			x: point.x - origin.x,
			y: point.y - origin.y,
		}

		// Calculate the angle of the direction vector
		const angle = Math.atan2(direction.y, direction.x)

		// Calculate the distance from origin to point
		const distance = Math.sqrt(direction.x ** 2 + direction.y ** 2)

		// Check if the angle is within the specified range and the distance is within the specified length
		return angle >= minAngle && angle <= maxAngle && distance <= length
	}
	
}
