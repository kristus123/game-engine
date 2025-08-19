import { G } from '/static/engine/G.js'; 
import { Iterate } from '/static/engine/Iterate.js'; 
import { a } from '/static/engine/a.js'; 
import { ExponentialNumber } from '/static/engine/animation/ExponentialNumber.js'; 
import { InverseExponentialNumber } from '/static/engine/animation/InverseExponentialNumber.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Ally } from '/static/game/Ally.js'; 
import { Money } from '/static/game/Money.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { MonsterWave } from '/static/game/MonsterWave.js'; 
import { Store } from '/static/game/Store.js'; 
import { Tilemaps } from '/static/game/Tilemaps.js'; 
import { Player } from '/static/game/player/Player.js'; 

export class World {
	constructor() {



		G.player = new Player(new Position(700, 2800))
		Camera.followInstantly(G.player)
		Controller.control(G.player)


		new Ally(new Position(700, 2800, 10, 10))
		new Ally(new Position(2000, 2800, 10, 10))

		const e = new InverseExponentialNumber(10, 100)
		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			G.player,


			new Quest(Iterate(100, i => () =>
				new class {
					constructor() {
						this.localObjects = new LocalObjects([
							this.m = new MonsterWave(e.value, () => {
								setTimeout(() => {
									e.next()
									this.completed = () => true
								}, 1000)
							}),
						])
					}

					completed() {
						return false
					}

					update() {
						this.localObjects.update()
					}

					draw(draw, guiDraw) {
						this.localObjects.draw(draw, guiDraw)
					}

				}
			)),
			Money.init(),
			Store.init(),
			G.monsters,
			G.allies,
			this.tilemaps = new Tilemaps()
		])

	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
