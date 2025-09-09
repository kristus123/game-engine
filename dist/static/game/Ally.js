import { G } from '/static/engine/G.js'; 
import { Random } from '/static/engine/Random.js'; 
import { Bounce } from '/static/engine/animation/Bounce.js'; 
import { Sine } from '/static/engine/animation/Sine.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { Sound } from '/static/engine/audio/Sound.js'; 
import { Splash } from '/static/engine/graphics/particles/Splash.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { Charge } from '/static/engine/mechanics/Charge.js'; 
import { LinePathFinder } from '/static/engine/mechanics/LinePathFinder.js'; 
import { PathFinder } from '/static/engine/mechanics/PathFinder.js'; 
import { WalkableAreas } from '/static/engine/mechanics/invisible_walls/WalkableAreas.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Money } from '/static/game/Money.js'; 

export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 1000)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.sine = new Sine(1, 2, 0.05),
			this.charge = new Charge(1, 100),
			this.splash = new Splash(),
			this.walkableAreas = new WalkableAreas(),
			this.bounce = new Bounce(this),
			this.linePathFinder = new LinePathFinder(this, G.player, this.walkableAreas)
		])


		this.charge.position = this.position.offset(0, -100)



		G.allies.add(this)
	}

	update() {
		this.walkableAreas.enforce(this)

		this.localObjects.update()
	}

	draw(draw) {
		if (G.player.within(100, this) && this.charge.ready) {
			this.charge.exhaust()
			this.splash.random(this, 'orange')
			Money.increase(1)
			Html.fadeaway('+1', this.position.offset(-100))
			Sound.nya.playRandom()
			this.bounce.start()
		}

		if (this.turret == null || G.pause || !this.touches(this.turret)) {
			this.localObjects.draw(draw)
		}

		this.position.scale(this.sine.value)
	}

}
