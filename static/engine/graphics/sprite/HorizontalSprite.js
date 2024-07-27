export class HorizontalSprite {
	constructor(position, imagePath, speed=100) {
		const sprite = new Sprite(position, imagePath, [
			{ x: 0, y: 0 },
		], speed)

		const x = setInterval(() => {
			if (sprite.image.complete) {
				const frameSequence = []
				for (let i = 0; i < sprite.image.width / sprite.width; i++) {
					console.log(i)
					frameSequence.push({x: i, y:0})
				}
				sprite.frameSequence = frameSequence

				console.log("hei")
				clearInterval(x)
			}
		}, 10);


		this.localObjects = new LocalObjects([sprite])
	}

	update() {



		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
