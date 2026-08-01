export class Calculate {

	static directionBetween(player, mousePosition) {

		const angle = Math.atan2(mousePosition.y - player.y, mousePosition.x - player.x)

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

	static isObjectWithinTheAngle(object, player, mousePosition, angleWidth) {
		angleWidth = angleWidth * 0.3
		angleWidth = Math.abs(angleWidth)

		const angle = Math.atan2(mousePosition.y - player.y, mousePosition.x - player.x)
		const objectAngle = Math.atan2(object.y - player.y, object.x - player.x)

		// Convert angles to degrees and normalize them to the range [0, 360)
		const normalizedAngle = ((angle * 180 / Math.PI) + 360) % 360
		const normalizedObjectAngle = ((objectAngle * 180 / Math.PI) + 360) % 360

		// Calculate the angular range
		let startAngle = (normalizedAngle - angleWidth / 2 + 360) % 360
		let endAngle = (normalizedAngle + angleWidth / 2 + 360) % 360

		// Handle cases where the range crosses the 0/360 boundary
		if (startAngle > endAngle) {
			return normalizedObjectAngle >= startAngle || normalizedObjectAngle <= endAngle
		}
		else {
			// Ensure that the object is strictly within the angular range
			return normalizedObjectAngle > startAngle && normalizedObjectAngle < endAngle
		}
	}
}
