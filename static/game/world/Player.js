export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

		this.position.width = 110
		this.position.height = 150

		this.forward = new Sprite(this.position, '/static/assets/farmer_16x16.png', [
			{x:0, y:0},
			{x:1, y:0},
			{x:2, y:0},
			{x:3, y:0},
			{x:4, y:0},
		])

		this.right = new Sprite(this.position, '/static/assets/farmer_16x16.png', [
			{x:5, y:0},
			{x:6, y:0},
			{x:7, y:0},
			{x:8, y:0},
			{x:9, y:0},
		])

		this.up = new Sprite(this.position, '/static/assets/farmer_16x16.png', [
			{x:10, y:0},
			{x:11, y:0},
			{x:12, y:0},
			{x:13, y:0},
			{x:14, y:0},
		])

		this.steps = []
		setInterval(() => {
			this.steps.push(this.position.offset(50, 200, 50, 20).copy())
			List.retainMax(this.steps, 4)
		}, 400)
	}

	update() {
		for (const e of Registry.enemies) {
			if (e.within(100, this)) {
				if (e.blinded) {
					e.kill()
				}
			}
		}
	}

	draw(draw, guiDraw) {
		if (super.movingUp) {
			this.up.draw(draw, guiDraw)
		}
		else if (super.movingDown) {
			this.forward.draw(draw, guiDraw)
		}
		else if (super.movingRight) {
			this.right.draw(draw, guiDraw)
		}
		else if (super.movingLeft) {
			this.right.mirrorDraw(draw, guiDraw)
		}
		else {
			this.forward.draw(draw, guiDraw)
		}

		this.position.x = Math.round(this.position.x)
		this.position.y = Math.round(this.position.y)
	}
}
