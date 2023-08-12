class GameLoop {

	static update = (ctx, canvas) => {
		console.log("replace me")
	}

	static draw = (ctx, canvas) => {
		console.log("replace me")
	}

	static start() {
		const canvas = document.getElementById("game")
		canvas.width = 1280
		canvas.height = 720

		const ctx = canvas.getContext("2d")

		setInterval(() => {
			ctx.save()
			ctx.fillStyle = "black"
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			this.update(ctx, canvas);
			this.draw(ctx, canvas);

			ctx.restore()

		}, 1000/60)


		return {ctx, canvas}
	}
}
