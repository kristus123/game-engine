import { Init } from '/static/engine/Init.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { InfiniteListLooper } from '/static/engine/code_tools/InfiniteListLooper.js'; 
import { ListLooper } from '/static/engine/code_tools/ListLooper.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Hp } from '/static/engine/hp/Hp.js'; 
import { StraightPath } from '/static/engine/mechanics/StraightPath.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Registry } from '/static/engine/objects/Registry.js'; 

export class Enemy extends DynamicGameObject {
	constructor(position) {
		super(position, 1000, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 100
		this.position.height = 100

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/bad_ninja.png'),

			Init(this, {
				hp: new Hp(this, 100, 100),
				straightPath: new StraightPath(this, Registry.player),
			}),
		])

		this.points = new InfiniteListLooper([new Position(600, 200), new Position(800, -300)])
	}

	update() {
		if (this.straightPath.clear && this.within(300, Registry.player)) {
			ForcePush(this).towards(Registry.player, 20)
		}
		else {
			this.points.goThrough(point => {
				ForcePush(this).towards(point, 10)

				if (this.within(100, point)) {
					this.points.next()
				}
			})
		}

		this.localObjects.update()
	}

	markBlinded() {
		this.blinded = true

		setTimeout(() => {
			this.blinded = false
		}, 2_000)
	}

	kill() {
		this.handledBy.add(new class {
			constructor(position) {
				this.sprite = new TriggerSprite(position.offset(-200, -200, 500, 500), '/static/assets/kill_blood_animation_32x32.png', [
					// { x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 2, y: 0 },
					{ x: 3, y: 0 },
					{ x: 4, y: 0 },
					{ x: 5, y: 0 },
				], 50)

				this.sprite.play()
			}

			update() {
				if (this.sprite.pause) {
					this.removeFromLoop()
				}
			}

			draw(draw, guiDraw) {
				this.sprite.draw(draw, guiDraw)
			}
		}(this.position))

		this.removeFromLoop()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.blinded) {
			draw.text(this.position.offset(0, -100), '🫣')
		}
	}

}
