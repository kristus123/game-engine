export function Canvas(width, height) {
	const canvas = document.createElement("canvas")
	canvas.width = width
	canvas.height = height

	const canvasStream = canvas.captureStream(30)

	const ctx = canvas.getContext("2d")

	return {
		canvas,
		canvasStream,
		ctx,
	}
}
