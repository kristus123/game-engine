export class Canvas {
	static main(width, height) {
		const canvas = document.getElementById("game")
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext("2d")

		return { canvas, ctx }
	}

	static offscreen(width, height) {
		const canvas = new OffscreenCanvas(width, height);
		const ctx = canvas.getContext('2d');
		
		return { canvas, ctx }
	}
	
}
