import { G } from '/static/engine/G.js'; 
import { Wait } from '/static/engine/Wait.js'; 
import { a } from '/static/engine/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { BottomText } from '/static/game/BottomText.js'; 
import { Money } from '/static/game/Money.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { MonsterWave } from '/static/game/MonsterWave.js'; 
import { Player } from '/static/game/Player.js'; 
import { Tilemaps } from '/static/game/Tilemaps.js'; 

export class World {
	constructor() {


		Camera.followInstantly(new Position(500, 500))

		this.tilemaps = new Tilemaps()

		this.player = new Player(new Position(0, 0))
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			this.player,


			new Quest([
				() => new MonsterWave(this.tilemaps, 5),
				() => new Wait(5_000, () => {
					new BottomText(['you did it, fucking bastard!'])
				}),
				() => new MonsterWave(this.tilemaps, 10),
			]),
			Money.init(),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
