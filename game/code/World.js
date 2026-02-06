export class World {
	constructor() {
		setTimeout(() => {
			this.x = true
		}, 500)
		setTimeout(() => {
			this.x = false
		}, 3000)
		this.objects = Objects([
			this.goat = Sprite.player(D1, Position(0, 0)),
			OnTrue(() => this.x, (onFalse) => {
				console.log(0)
				onFalse(() => {
					this.goat.tags.prepareSleep.play(() => {
						this.goat.tags.sleep.loop()
					})
					console.log(false)
				})
			}),
			ManualLoop((i, next, stop) => {

				if (i == 3) {
					stop()
				}
				else {
					this.goat.tags.happy.play(() => {
						next()
					})
				}
			}).onFinish(() => {
			})
		])

	}

	update() {
		this.objects.update()
	}
}
