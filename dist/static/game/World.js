import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { After } from '/static/engine/on/After.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { BottomText } from '/static/game/BottomText.js'; 
import { Money } from '/static/game/Money.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { Tilemaps } from '/static/game/Tilemaps.js'; 

export class World {
	constructor() {


		Camera.followInstantly(new Position(500, 500))

		this.tilemaps = new Tilemaps()

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			new Money(),
			new BottomText([
				"when life is hard, just remember",
				"It will get harder",
				"It will get so hard that you will cry",
				"That is a small step towards your next part in life",
				"So when you are about to cry....",
			]),
			new After(500, () => {
				this.localObjects.add(new Monster(this.tilemaps.enemyWalkTiles))
			}),
		])

		// if (this.tilemaps.touchesTurretTiles(p)) {
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (Mouse.onClick) {
			draw.rectangle(new Position(Mouse.position.x, Mouse.position.y, 100, 100))

			
			const valid = this.tilemaps.touchesTurretTiles(Mouse.position)
			const p = new Position(Mouse.position.x, Mouse.position.y, 100, 100)
			draw.color(p, valid ? 'green': 'red')
		}
	}
}
