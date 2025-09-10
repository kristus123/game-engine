export function Normalize(distance, maxDistance, inverted = false) {
	const outputMin = 1 // Minimum of output range
	const outputMax = 10 // Maximum of output range

	const min = inverted ? outputMax : outputMin
	const max = inverted ? outputMin : outputMax

	return min + (max - min) * (distance / maxDistance)
}
