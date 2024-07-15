export class Kid extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 10)
		this.position.width = 170
		this.position.height = 300

		this.picture = new StaticPicture(this.position, '/static/assets/kid.png')

		this.chicken = new Chicken(this.position.offset(200, 800).copy())

		this.quest = new Quest([
			() => new (class {
				constructor(kid, player) {
					this.kid = kid
					this.player = player

					this.chicken = this.kid.chicken
					this.movableObjects = new MovableObjects(this.player, [this.chicken])

					this.button = new Button(kid.position.right(50), 'of course!', (b) => {
						Html.remove(b)
						QuestList.add('find his cat')
					})
				}
				completed() {
					if (this.chicken.within(200, this.kid) || this.chicken.touches(this.kid)) {
						this.chicken.velocity.x = 0
						this.chicken.velocity.y = 0
						Html.remove(this.button)
						return true
					}
					else {
						return false
					}
				}

				update() {
					this.movableObjects.update()
				}

				draw(draw, guiDraw) {
					this.movableObjects.draw(draw, guiDraw)

					if (this.kid.within(300, this.player)) {
						draw.text(this.kid.position.over(), 'can you help me? My chicken is missing')
					}
					else {
						draw.text(this.kid.position.over(), '!!!')
					}
				}
			})(this, this.player),

			() => new (class {
				constructor(kid, player) {
					this.kid = kid
					this.player = player

					this.chicken = this.kid.chicken
				}
				completed() {
					return false
				}

				update() {
				}

				draw(draw, guiDraw) {
					if (this.kid.within(300, this.player)) {
						draw.text(this.kid.position.over(), 'THANK YOU!')
					}
				}
			})(this, this.player),
		])
	}

	update() {
		this.button.update()
		this.quest.update()
		this.chicken.update()
	}

	draw(draw, guiDraw) {
		this.quest.draw(draw, guiDraw)
		this.picture.draw(draw, guiDraw)
		this.chicken.draw(draw, guiDraw)
	}
}
