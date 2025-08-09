import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 

const scale = 8

export class World {
	constructor() {


		Camera.follow(new Position(0, 0))

		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
		this.width = this.jsonFile.tilemaps[0].width
		this.height = this.jsonFile.tilemaps[0].height

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		for (const e of this.jsonFile.tilemaps[0].tiles) {
			if (e.i == 3) {
				const offsetX = Mouse.position.x
				const offsetY = Mouse.position.y

				draw.transparentGreenRectangle(new Position(
					e.x*scale*this.width + offsetX,
					e.y*scale*this.height + offsetY,
					this.width*scale,
					this.height*scale
				))
			}
		}
	}
}
