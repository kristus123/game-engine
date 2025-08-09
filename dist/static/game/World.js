import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 

const scale = 8

export class World {
	constructor() {


		Camera.follow(new Position(0, 0))

		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
		console.log(this.jsonFile)
		this.width = this.jsonFile.tilemaps[0].width
		this.height = this.jsonFile.tilemaps[0].height

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
		])


		Html.lower([
			Html.div('big', [
				Html.p('hei and nadsdjfkajlsdf sjkli ficking love you'),
				Html.button('next'),
			]),
				Html.button('next'),
				Html.button('next'),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		for (const e of this.jsonFile.tilemaps[0].tiles) {

			if (e.i == 3) {
				draw.transparentGreenRectangle(new Position(
					e.x * scale * this.width,
					e.y * scale * this.height,
					this.width * scale,
					this.height * scale
				))
			}
		}
	}
}
