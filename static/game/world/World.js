export class World {
	constructor() {

		const player = new Player(new Position(-410,10, 300, 500), '/static/assets/god_48x56.png', [{x:1,y:0}])
		this.player = player
		Controller.control(player)

		this.followPlayerNoise = new Noise(new Position(-100,0, 2000, 2000))
		Cam.follow(this.player)

		this.localObjects = new LocalObjects([
			this.followPlayerNoise,
			Init(this, {
				store: new Store(),
				mic: new Microphone(),
				chicken: new Chicken(new Position(-200, 0), chicken => {
					if (Mouse.hovering(chicken)) {
						chicken.kill()
						chicken.run = () => {}
						setTimeout(() => {
							chicken.removeFromLoop()
						}, 3000)
					}
				}),
			}),
			G.ranches,
			G.monsters,
			G.poop,
			G.workers,
			G.splash,
			G.trees,
			G.barn,
			Init(this, {
				picturePositions: new PicturePositions(G.Pictures.test),
			}),
			new Npc(new Position(-110,-100, 100, 200), '/static/assets/girl.png'),
			player,
		])

		Html.addToScreen(Html.div('lower-center-ui', [
			Html.slider(),
			HtmlProgressBar.create(),
		]))

		G.ranches.add(new Ranch(new Position(0, 0)))
		G.monsters.add(new SimpleMonster(new Position(0, 0)))

		BottomText.show('Welcome!', 2_000)

		// LoadingScreen.show()
		// QuestList.add('eat ass')
		// QuestList.show()
	}

	update() {
		
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
