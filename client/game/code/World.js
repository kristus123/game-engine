export class World {
	constructor() {
		// Page.go(PracticePage)

		// Out.js Test
		console.log(window.mediasoup)

		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			Sprite.fireplace(WorldPosition(1512, 2100)),
			this.player = Player(WorldPosition(1800, 2100)),
			OnTrue(() => this.player.within(200, WorldPosition(1642, 1907)), () => {
				Tts('wo---ooo-ooo-ooow. a sami lavvo')
			}),
			OnTrue(() => this.player.within(200, WorldPosition(1600, 2233)), () => {
				Tts('woooo-oooow. a fireplace')
			}),
			Dialog([
				{text: "how are you", sleepEnd: 200},
				{text: "It is time we learn about the Sami people", sleepEnd: 100},
				{text: "Sit down, and relax", sleepEnd: 100},
				{text: "We need some berries. go pick some!", sleepEnd: 1000},
			], () => {
				console.log("wow")
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
