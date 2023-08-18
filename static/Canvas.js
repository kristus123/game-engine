class Canvas {
	static main(width, height) {
		const canvas = document.getElementById("game")
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext("2d")

		return { canvas, ctx }
	}

	static hidden(width, height) {
		const hiddenCanvas = document.createElement("canvas")
		hiddenCanvas.width = width
		hiddenCanvas.height = height
		const hiddenCtx = hiddenCanvas.getContext("2d")

		return { hiddenCanvas, hiddenCtx }
	}
	
}
