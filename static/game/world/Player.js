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

		this.jumpingDraw = new Sprite(this.position, '/static/assets/farmer_carrying_16x16.png', [
			{x:0, y:0},
			{x:1, y:0},
			{x:2, y:0},
			{x:3, y:0},
			{x:4, y:0},
			{x:5, y:0},
		])

		this.carryingDraw = new Sprite(this.position, '/static/assets/farmer_carrying_16x16.png', [
			{x:6, y:0},
			{x:7, y:0},
			{x:8, y:0},
		])

		this.handsUp = new Sprite(this.position, '/static/assets/farmer_idle_16x16.png', [
			{x:1, y:0},
		])

		this.idle = new HorizontalSprite(this.position, '/static/assets/farmer_idle_16x16.png')

		this.steps = []
		setInterval(() => {
			this.steps.push(this.position.offset(50, 200, 50, 20).copy())
			List.retainMax(this.steps, 4)
		}, 400)

		KeyDown(' ', () => { // space
			this.jumpingDraw.reset()
			this.jumping = true
			setTimeout(() => {
				this.jumping = false
			}, 300);
		})

		this.localObjects = new LocalObjects([
			Init(this, {
				pickUp: new PickUp(() => [...Registry.Chicken, ...Registry.ChickenBox]),
				throw: new Throw(),
			}),
			new OnChange(() => this.pickUp.holding, holding => {
				if (holding && holding instanceof Chicken) {
					this.chicken = holding
				}
			})
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.jumping) {
			this.jumpingDraw.draw(draw, guiDraw)
		}
		else if (this.pickUp.holding) {
			this.carryingDraw.draw(draw, guiDraw)
		}
		else if (super.movingUp) {
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
			this.idle.draw(draw, guiDraw)
		}

		this.position.x = Math.round(this.position.x)
		this.position.y = Math.round(this.position.y)
	}
}
