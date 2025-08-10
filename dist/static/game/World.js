import { G } from '/static/engine/G.js'; 
import { Random } from '/static/engine/Random.js'; 
import { a } from '/static/engine/a.js'; 
import { Audio } from '/static/engine/audio/Audio.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
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
		

		Html.upperLeft([
			Html.button('buy turret', () => {

				Mouse.onClick = p => {
					console.log("hei")
					chat(Random.choice([
						['wow you bought a turret', 'you are really good'],
						['i am an edgy boy'],
					]))
					this.localObjects.add(new Turret(p.copy()))
					Audio.click()
					Mouse.onClick = null
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
		}

		for (const p of this.walkableTiles) {

			if (p.i == 2) {
				// draw.transparentRedRectangle(p.position)
			}
		}
	}
}
