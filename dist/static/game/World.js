import { G } from '/static/engine/G.js'; 
import { Random } from '/static/engine/Random.js'; 
import { a } from '/static/engine/a.js'; 
import { Audio } from '/static/engine/audio/Audio.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { Turret } from '/static/game/Turret.js'; 

const scale = 8

export class World {
	constructor() {


		Camera.followInstantly(new Position(500, 500))

		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
		console.log(this.jsonFile)
		this.width = this.jsonFile.tilemaps[0].width
		this.height = this.jsonFile.tilemaps[0].height


		this.walkableTiles = []
		for (const e of this.jsonFile.tilemaps[0].tiles) {
			this.walkableTiles.push({
				i: e.i,
				position: new Position(
					(e.x * scale * this.width),
					(e.y * scale * this.height),
					this.width * scale,
					this.height * scale,
				)
			})
		}

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),

			new Turret(new Position(400, 800)),
		])

		setInterval(() => {
<<<<<<< HEAD
			this.localObjects.add(new Monster(this.walkableTiles.filter(t => t.i == 2).map(t => t.position)),)
		}, 200);


		const chat = (texts) => {
			this.localObjects.add(new Quest(texts.map(t => () =>  new class {
					constructor() {
						Html.lower([
							Html.img(),
							Html.div('big', [
								Html.p(t),
								Html.button('next', () => {
									Html.clearLower()
									this.completed = () => true
								})
							]),
						])
					}
				})))
		}
		
||||||| parent of 2bcab68 (x)
			this.localObjects.add(new Monster(this.walkableTiles.filter(t => t.i == 2).map(t => t.position)),)
		}, 200);
		
		Html.lower([
			Html.div('big', [
				Html.p('hei fucker bitch'),
			]),
		])
=======
			this.localObjects.add(new Monster(this.walkableTiles.filter(t => t.i == 2).map(t => t.position)))
		}, 200)

		Html.lower([
			Html.div('big', [
				Html.picture(),
				Html.p('fight with honor!'),
			]),
		])
>>>>>>> 2bcab68 (x)

		Html.upperLeft([
			Html.button('buy turret', () => {

				Mouse.onClick = p => {
<<<<<<< HEAD
					console.log("hei")
					chat(Random.choice([
						['wow you bought a turret', 'you are really good'],
						['i am an edgy boy'],
					]))
					this.localObjects.add(new Turret(p.copy()))
					Audio.click()
					Mouse.onClick = null
||||||| parent of 2bcab68 (x)
					console.log("hei")
					this.localObjects.add(new Turret(p.copy()))
					Audio.click()
					Mouse.onClick = null
=======
					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						console.log('hei')
						this.localObjects.add(new Turret(p.copy()))
						Audio.click()
						Mouse.onClick = null
					}
>>>>>>> 2bcab68 (x)
				}

			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		if (Mouse.onClick) {
			draw.rectangle(new Position(Mouse.position.x, Mouse.position.y, 100, 100))

			if (!new Square(Mouse.position, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
				draw.color(new Position(Mouse.position.x, Mouse.position.y, 100, 100), 'red')
			}
			else {
				draw.color(new Position(Mouse.position.x, Mouse.position.y, 100, 100), 'green')
			}
		}

		for (const p of this.walkableTiles) {
			// if (p.i == 1) {
			// 	draw.transparentRedRectangle(p.position)
			// }

			// if (p.i == 2) {
			// 	draw.transparentRedRectangle(p.position)
			// }
		}
	}
}
