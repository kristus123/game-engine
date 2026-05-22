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
			Quest([
				() => {
					const d = Dialogue(this.oldSami.position, [
						{ text: "Come here young man", sleepEnd: 1000 },
					])
					return {
						completed: () => this.oldSami.within(10, this.player),
						update: () => {
							d.update()
							console.log("hei")
							this.oldSami.forcePushTo(this.player, 50)
						},
					}
				},
				() => {
					let done = false
					const d = Dialogue(this.oldSami.position, [
						{
							text: "you were supposed to clean the playground",
							sleepEnd: 1000,
						},
						{
							text: "what are you, a poop?",
							sleepEnd: 1000,
						},
						{
							position: this.player.position,
							text: "sorry chief",
							sleepEnd: 1000,
						},
						{
							text: "don't worry chump",
							sleepEnd: 1000,
						},
						{
							text: "just don't fool anymore around",
							sleepEnd: 1000,
						},
					], () => {
						done = true
					})
					return {
						completed: () => done,
						update: () => {
							d.update()
						},
					}
				},
			]),
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
			...Iterate(100, () => {
				return Reindeer()
			}),
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
