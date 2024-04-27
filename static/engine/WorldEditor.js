export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new DynamicGameObject(0, 0, 10, 10, 4500, 50))

		this.runAll = new RunAll([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			// new Planet(0, 0),
			// new Grid(mouse),
		])

		ObjectMapper.fromFile(Http.get('/world-editor')).objects.forEach(o => {
			this.runAll.add(ObjectMapper.x(o))
		})

		mouse.addOnClick('paint', p => {
			p.height = 100
			p.width = 100
			const o = new StaticPicture(p, 'https://i.imgur.com/w9dZE0H.png')

			this.runAll.add(o)

			const saved = Http.get('/world-editor')
			saved.objects.push(ObjectMapper.toJson(o))
			Http.post('/world-editor', saved)
		})

		KeyDown('-', () => {
			console.log('zooming out')
			camera.zoom -= 0.5
		})

		KeyDown('_', () => {
			console.log('zooming in')
			camera.zoom += 0.5
		})
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
