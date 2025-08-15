import { G } from '/static/engine/G.js'; 
import { Iterate } from '/static/engine/Iterate.js'; 
import { a } from '/static/engine/a.js'; 
import { ExponentialNumber } from '/static/engine/animation/ExponentialNumber.js'; 
import { InverseExponentialNumber } from '/static/engine/animation/InverseExponentialNumber.js'; 
import { Sound } from '/static/engine/audio/Sound.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { DeathText } from '/static/game/DeathText.js'; 
import { Money } from '/static/game/Money.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { MonsterWave } from '/static/game/MonsterWave.js'; 
import { Turret } from '/static/game/Turret.js'; 
import { Player } from '/static/game/player/Player.js'; 

export class World {
	constructor() {


		Camera.followInstantly(new Position(500, 500))

		Sound.theme()

		this.player = new Player(new Position(0, 0))
		Controller.control(this.player)
		Camera.followInstantly(this.player)

		const e = new InverseExponentialNumber(10, 100)
		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			this.player,



			new Quest(Iterate(10, i => () =>
				new class {
					constructor() {
						new DeathText('round ' + i).show()
						this.localObjects = new LocalObjects([
							this.m = new MonsterWave(e.value, () => {
								setTimeout(() => {
									e.next()
									console.log("ready for next")
									this.completed = () => true
								}, 1000);
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
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(300, 0)),
			new Turret(new Position(800, 0)),
			new Turret(new Position(800, 0)),
			new Turret(new Position(800, 0)),
			G.monsters,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
