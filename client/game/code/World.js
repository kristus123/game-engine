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
			Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			this.fireplace = Sprite.fireplace(WorldPosition(1512, 2100)),
			this.player = Player(WorldPosition(1800, 2100)),
			OnChange(() => this.player.within(200, this.fireplace), b => {
				this.player.toggleTag("warm", b)
			}),
			OnTrue(() => this.player.within(200, WorldPosition(1642, 1907)), () => {
				Tts("sami lavvo")
			}),
			OnTrue(() => this.player.within(200, WorldPosition(1600, 2233)), () => {
				Tts("fireplace")
			}),
			Dialogue(this.player.position, [
				{ text: "how are you", sleepEnd: 200 },
				{ text: "It is time we learn about the Sami people", sleepEnd: 100 },
				{ text: "Sit down, and relax", sleepEnd: 100 },
				{ text: "We need some berries. go pick some!", sleepEnd: 1000 },
			], () => {
				console.log("wow")
			}),
			...Iterate(200, () => {
				return Reindeer()
			}),
		])

		Camera.follow(this.player)
		Controller.control(this.player)

	}

	update() {
		this.objects.update()

		D1.text(Mouse.position, `${Mouse.position.x} ${Mouse.position.y}`)
	}
}
