export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.rice = 0
		this.finished = false

		this.localObjects = new LocalObjects([

			{introMessage: new MultiTextTyper(this.player.position.offset(0, -100), [
				'JEG ER TOM FOR RIS',
				'Jeg får plukke opp alt jeg finner',

			])},
			this.player,
			new Rices(this.player, () => {
				this.localObjects.remove(this.introMessage)

				BottomText.show('get in the car. TIME FOR GYM')

				const bil = new Bil(this.player)
				const compass = new Compass([bil])
				this.localObjects.add(compass)
				bil.onEnter = () => {
					console.log("bil entwered")
					BottomText.remove()
					const bestemor = this.localObjects.add(new MultiTextTyper(this.player.position.offset(0, -100), [
						'TRENGER IKKE PROTTEPULVER NÅR MAN ER ET BEIST',
					]))
					compass.clear()
					const gym = new Square(this.player.position.offset(8000,0).copy(), 200)
					this.localObjects.add(gym)
					compass.add(gym)
					BottomText.show('GO TO GYM!!!! follow the red dot')
					this.localObjects.add({update: () => {
						if (Distance.within(400, gym, this.player)) {
							this.localObjects.remove(bestemor)
							bil.velocity.reset()
							BottomText.show('TIME TO PUMP')
							this.localObjects.remove(compass)

							this.localObjects.add(new MultiTextTyper(gym.position.offset(0, -100), [
								'velkom to big bott gym',
								'press E to exit vecicle',
							]))

							this.lifter.position = this.player.position.copy()

							this.localObjects.remove(bil)
						}
					}})
				}
				this.localObjects.add(bil)

				this.localObjects.add(new MultiTextTyper(this.player.position.offset(0, -100), [
					'sweeet',
				]))

			}),

			{lifter: new PicturesLoop(this.player.position.offset(-1000).copy())},

		], this)

	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
