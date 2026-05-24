export class World {
	constructor() {
		// Page.go(PracticePage)

		// Out.js Test
		console.log(window.mediasoup)

		console.log(AudioBuffers.theme)
		setTimeout(() => {
			Sound.playBuffer(AudioBuffers.theme)
		}, 2000)

		this.objects = Objects([
			this.world = Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			this.fireplace = Sprite.fireplace(WorldPosition(1512, 2100)),
			this.player = Player(WorldPosition(1800, 2100)),
			this.oldSami = OldSami(),
			IntroQuest(this.player, this.oldSami),
		])

		Camera.follow(this.player)
		Controller.control(this.player)

		// TEST CODE BELOW! PROCEED WITH CAUTION!!

		// Uncomment To Tint
		//this.fireplace.tint(255, 55, 55, 255)

		// Uncomment To Mirror
		// this.fireplace.mirror()

		// Uncomment To Swap Color
		this.world.changeColor({
			"rgb(171,161,92)": {
				r: 0,
				g: 0,
				b: 255
			},
			"rgb(133,140,79)": {
				r: 255,
				g: 0,
				b: 0
			}
		})

		// Uncomment To Reset Changes
		this.world.reset()
	}

	update() {
		this.objects.update()

		D1.text(Mouse.position, `${Mouse.position.x} ${Mouse.position.y}`)
	}

}
