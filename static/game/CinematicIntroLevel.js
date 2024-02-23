export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.deliveryDrone = new GameObject(0, 400, 10, 10, 10, 2)
		camera.followInstantly(this.deliveryDrone)
		this.world.controller.control(this.deliveryDrone)

		this.t = new MultiTextTyper(this.deliveryDrone.position.offset(0, 200), [
			'Current objective:',
			'Deliver package',
			'',
			'',
			'Would be nice to have a greater purpose',
			'',
			'',
			'Maybe one day',
			'',
			'',
			'But not today',
			'',
			'',
			'',
			'',
		])


		this.runAll = new RunAll([
			this.t,
			this.world,
			this.deliveryDrone,
		])

		AudioEngine.play()
	}

	update() {
		Steps
			.once(() => {
				console.log('hallo')
			})
			.once(() => {
				console.log('hei på dei')
			})
			.wait(2_000)
			.until(() => {
				console.log('ahahah')
				return true
			})
			.loop()


		this.runAll.update()

		RunOnce(Distance.withinRadius(this.deliveryDrone, this.world.player, 300), () => {
			this.runAll.remove(this.t)

			this.world.controller.control(this.world.player)
			this.world.camera.follow(this.world.player)

			this.deliveryDrone.resetVelocity()

			this.runAll.add(new MultiTextTyper(this.world.player.position, ['who are you?']))

			setTimeout(() => {
				this.runAll.add(new MultiTextTyper(this.deliveryDrone.position, ['I am here to help']))
			}, 1500)

			setTimeout(() => {
				this.runAll.add(new MultiTextTyper(this.deliveryDrone.position, ['I have your piss equipment']))
			}, 6000)
		})
	}

	draw(draw) {
		this.runAll.draw(draw)

		draw.objectThatIsMovingInRectangularPathAroundObject(this.deliveryDrone, this.world.player.position.center)
	}

}
