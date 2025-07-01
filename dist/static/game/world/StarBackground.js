import { Iterate } from '/static/engine/code_tools/Iterate.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Parallax } from '/static/engine/graphics/Parallax.js'; 

export class StarBackground {
	constructor() {


		this.stars = Iterate(50, i => ({
			position: Random.direction(Camera.position, 1000),
			color: Random.choice(['#638782', '#304e4f', '#1f2d2c', '#15282a', 'white']),
		}))
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.stars.forEach((star) => {
			const position = Parallax(star.position, 0.99)
			draw.star(position, star.color)
		})
	}
}
