export class Sun {
	constructor() {
		const numStars = 1000
		this.suns = []
		for (let i = 0; i < numStars; i++) {
			const x = Random.integerBetween(-10000, 10000)
			const y = Random.integerBetween(-10000, 10000)
			const width = Math.random() * 1 + 1 // Varying star widths
			const height = Math.random() * 1 + 1 // Varying star heights

			this.suns.push({ x, y, width, height })
		}
	}

	update() {

	}

	draw(ctx) {
		ctx.drawImage('/static/assets/Chicken_Sprite_Sheet.png', 0, 0, 10, 10)
		// ctx.fillStyle = 'white'
		// this.suns.forEach((s) => {
		// 	// Draw.rectangle(ctx, s.x, s.y, s.width, s.height, 'white', 'white')
		//     ctx.drawImage('/static/assets/Chicken_Sprite_Sheet.png', s.x, s.y, s.width, s.height)
		// })
	}
}
