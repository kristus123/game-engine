export class World {
	constructor() {

		const player = new Player(new Position(-410,10, 300, 500), '/static/assets/god_48x56.png', [{x:1,y:0}])
		this.player = player
		Controller.control(player)
		G.player = player

		this.followPlayerNoise = new Noise(new Position(-100,0, 2000, 2000))
		Camera.follow(this.player)

		const npc = new Npc(new Position(-110,-100, 100, 200), '/static/assets/girl.png')

		G.zone = new PicturePositions(G.Pictures.chickenZone, new Position(-200,0)),

		this.localObjects = new LocalObjects([
			Init(this, {
				// picturePositions: new PicturePositions(G.Pictures.farm),
				x: new Picture(new Position(-200,0, 512*4, 320*4), '/static/assets/farm_512x320.png'),
			}),
			G.zone,
			// this.followPlayerNoise,
			Init(this, {
				store: new Store(),
				mic: new Microphone(),
				chicken: new Chicken(new Position(-200, 0), chicken => {
				}),
			}),

			G.ranches,
			G.monsters,
			G.poop,
			G.workers,
			G.splash,
			G.trees,
			G.barn,
			G.fire,
			npc,
			new Text(new Position(0,0), 'hei sexy mann'),
			player,

			new HorizontalSprite(new Position(-100,0, 200, 300), '/static/assets/fire_16x28.png'),
		])

		Controller.control(this.chicken)

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
